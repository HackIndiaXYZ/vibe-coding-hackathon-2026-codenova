import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Dynamically check if real credentials are provided
export const isLiveMode = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your-supabase-project-url' &&
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your_actual')
);

function toCamelCase(str: string) {
  return str.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
}

// Chainable & Thenable query builder for localStorage fallback
class MockQueryBuilder {
  private table: string;
  private filters: { field: string; value: any }[] = [];
  private orderBy: { field: string; ascending: boolean } | null = null;
  private isSingle = false;

  constructor(table: string) {
    this.table = table;
  }

  select(fields?: string) {
    return this;
  }

  eq(field: string, value: any) {
    this.filters.push({ field, value });
    return this;
  }

  order(field: string, options: { ascending: boolean } = { ascending: false }) {
    this.orderBy = { field, ascending: options.ascending };
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  async insert(data: any) {
    if (typeof window === 'undefined') return { data: null, error: null };
    try {
      const storageKey = `novalens_${this.table}`;
      const existingStr = localStorage.getItem(storageKey) || '[]';
      const list = JSON.parse(existingStr);

      const itemsToInsert = Array.isArray(data) ? data : [data];
      const insertedItems = itemsToInsert.map(item => ({
        id: item.id || 'ag_' + Math.random().toString(36).substring(2, 11),
        created_at: new Date().toISOString(),
        ...item
      }));

      list.push(...insertedItems);
      localStorage.setItem(storageKey, JSON.stringify(list));
      window.dispatchEvent(new Event('storage'));

      return {
        data: Array.isArray(data) ? insertedItems : insertedItems[0],
        error: null
      };
    } catch (e: any) {
      return { data: null, error: e };
    }
  }

  async delete() {
    return new MockDeleteBuilder(this.table, this.filters);
  }

  // Standard Thenable pattern (allows await on this builder object directly)
  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async execute() {
    if (typeof window === 'undefined') return { data: [], error: null };
    try {
      const storageKey = `novalens_${this.table}`;
      const dataStr = localStorage.getItem(storageKey) || '[]';
      let list = JSON.parse(dataStr);

      // Apply filtering
      for (const filter of this.filters) {
        list = list.filter((item: any) => {
          const itemValue = item[filter.field] !== undefined 
            ? item[filter.field] 
            : item[toCamelCase(filter.field)];
          return String(itemValue) === String(filter.value);
        });
      }

      // Apply sorting
      if (this.orderBy) {
        const { field, ascending } = this.orderBy;
        list.sort((a: any, b: any) => {
          const valA = a[field] !== undefined ? a[field] : a[toCamelCase(field)];
          const valB = b[field] !== undefined ? b[field] : b[toCamelCase(field)];
          if (valA === valB) return 0;
          if (valA === undefined || valA === null) return 1;
          if (valB === undefined || valB === null) return -1;
          
          if (typeof valA === 'string' && typeof valB === 'string') {
            return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
          }
          return ascending ? (valA < valB ? -1 : 1) : (valA < valB ? 1 : -1);
        });
      }

      if (this.isSingle) {
        if (list.length === 0) {
          return { data: null, error: { message: 'Not found' } };
        }
        return { data: list[0], error: null };
      }

      return { data: list, error: null };
    } catch (e: any) {
      return { data: this.isSingle ? null : [], error: e };
    }
  }
}

class MockDeleteBuilder {
  private table: string;
  private filters: { field: string; value: any }[] = [];

  constructor(table: string, filters: { field: string; value: any }[]) {
    this.table = table;
    this.filters = filters;
  }

  eq(field: string, value: any) {
    this.filters.push({ field, value });
    return this;
  }

  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async execute() {
    if (typeof window === 'undefined') return { data: null, error: null };
    try {
      const storageKey = `novalens_${this.table}`;
      const existingStr = localStorage.getItem(storageKey) || '[]';
      let list = JSON.parse(existingStr);

      const beforeLength = list.length;
      list = list.filter((item: any) => {
        return !this.filters.every(filter => {
          const itemValue = item[filter.field] !== undefined 
            ? item[filter.field] 
            : item[toCamelCase(filter.field)];
          return String(itemValue) === String(filter.value);
        });
      });

      localStorage.setItem(storageKey, JSON.stringify(list));
      window.dispatchEvent(new Event('storage'));

      return { data: { count: beforeLength - list.length }, error: null };
    } catch (e: any) {
      return { data: null, error: e };
    }
  }
}

// Custom local storage-based Mock Supabase client for zero-config demo mode
class MockSupabaseClient {
  auth = {
    signUp: async ({ email }: { email: string; password?: string }) => {
      if (typeof window === 'undefined') return { data: { user: null }, error: null };
      const user = { id: 'mock-user-id', email };
      const session = { user, access_token: 'mock-session-token' };
      localStorage.setItem('novalens_session', JSON.stringify(session));
      window.dispatchEvent(new Event('storage'));
      return { data: { user }, error: null };
    },
    signInWithPassword: async ({ email }: { email: string; password?: string }) => {
      if (typeof window === 'undefined') return { data: { user: null, session: null }, error: null };
      const user = { id: 'mock-user-id', email };
      const session = { user, access_token: 'mock-session-token' };
      localStorage.setItem('novalens_session', JSON.stringify(session));
      window.dispatchEvent(new Event('storage'));
      return { data: { user, session }, error: null };
    },
    signOut: async () => {
      if (typeof window === 'undefined') return { error: null };
      localStorage.removeItem('novalens_session');
      window.dispatchEvent(new Event('storage'));
      return { error: null };
    },
    getSession: async () => {
      if (typeof window === 'undefined') return { data: { session: null }, error: null };
      const sessionStr = localStorage.getItem('novalens_session');
      const session = sessionStr ? JSON.parse(sessionStr) : null;
      return { data: { session }, error: null };
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      if (typeof window === 'undefined') {
        return { data: { subscription: { unsubscribe: () => {} } } };
      }
      const handler = () => {
        const sessionStr = localStorage.getItem('novalens_session');
        const session = sessionStr ? JSON.parse(sessionStr) : null;
        callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
      };
      window.addEventListener('storage', handler);
      // Call once initially
      const sessionStr = localStorage.getItem('novalens_session');
      const session = sessionStr ? JSON.parse(sessionStr) : null;
      setTimeout(() => callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session), 0);

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              window.removeEventListener('storage', handler);
            }
          }
        }
      };
    }
  };

  from(table: string) {
    return new MockQueryBuilder(table);
  }
}

// Fallback logic for creation
const hasValidEnv = supabaseUrl && (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://')) && supabaseUrl !== 'https://placeholder.supabase.co' && !supabaseUrl.includes('placeholder');

export const supabase = isLiveMode && hasValidEnv
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (new MockSupabaseClient() as any);
