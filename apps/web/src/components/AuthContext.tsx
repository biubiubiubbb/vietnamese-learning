import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { accountApi, AccountError, type AccountUser } from '../lib/account';

interface AuthApi {
  user: AccountUser | null;
  loading: boolean;
  notice: string | null;
  setNotice: (text: string | null) => void;
  login: (username: string, password: string) => Promise<AccountUser>;
  register: (username: string, password: string) => Promise<AccountUser>;
  logout: () => Promise<void>;
  handleApiError: (error: unknown) => void;
}

const Ctx = createContext<AuthApi | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    accountApi
      .me()
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleApiError = useCallback((error: unknown) => {
    if (error instanceof AccountError) {
      if (error.status === 401) {
        setUser(null);
        setNotice('登录已过期，请重新登录');
        return;
      }
      if (error.status === 403) {
        setUser(null);
        setNotice(error.message || '账号已被禁用，请联系管理员');
        return;
      }
      setNotice(error.message);
      return;
    }
    setNotice('网络异常，本次记录未保存，请重试');
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const data = await accountApi.login(username, password);
    setUser(data.user);
    setNotice(null);
    return data.user;
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    const data = await accountApi.register(username, password);
    setUser(data.user);
    setNotice(null);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await accountApi.logout().catch(() => undefined);
    setUser(null);
    setNotice(null);
  }, []);

  const api = useMemo<AuthApi>(
    () => ({ user, loading, notice, setNotice, login, register, logout, handleApiError }),
    [user, loading, notice, login, register, logout, handleApiError],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
