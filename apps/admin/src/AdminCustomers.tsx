import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AdminPage,
  Banner,
  Button,
  Card,
  ConfirmDialog,
  Empty,
  Icon,
  IconButton,
  Loading,
  Select,
  TextInput,
  useNotice,
} from './ui';
import { customerApi, formatTime, type CustomerListResponse, type CustomerListRow } from './customerApi';

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'normal', label: '正常' },
  { value: 'disabled', label: '已禁用' },
];

function AccountState({ status }: { status: CustomerListRow['status'] }) {
  const normal = status === 'normal';
  return (
    <span className={`admin-account-state${normal ? '' : ' off'}`} title={normal ? '账号正常' : '账号已禁用'}>
      <Icon name={normal ? 'user' : 'user-off'} />
      {normal ? '正常' : '已禁用'}
    </span>
  );
}

export default function AdminCustomers() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get('q') ?? '';
  const status = params.get('status') ?? '';
  const page = Math.max(1, Number(params.get('page') ?? 1) || 1);

  const [searchDraft, setSearchDraft] = useState(q);
  const [data, setData] = useState<CustomerListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState<{ row: CustomerListRow; status: 'normal' | 'disabled' } | null>(null);
  const [busy, setBusy] = useState(false);
  const notice = useNotice();

  useEffect(() => {
    setSearchDraft(q);
  }, [q]);

  useEffect(() => {
    setLoading(true);
    setError('');
    customerApi
      .list({ q, status, page })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [q, status, page]);

  const updateParams = (next: { q?: string; status?: string; page?: number }) => {
    const search = new URLSearchParams();
    const nextQ = next.q ?? q;
    const nextStatus = next.status ?? status;
    const nextPage = next.page ?? 1;
    if (nextQ) search.set('q', nextQ);
    if (nextStatus) search.set('status', nextStatus);
    if (nextPage > 1) search.set('page', String(nextPage));
    setParams(search);
  };

  const submitSearch = () => updateParams({ q: searchDraft.trim(), page: 1 });

  const toggleStatus = async () => {
    if (!confirm) return;
    setBusy(true);
    try {
      await customerApi.setStatus(confirm.row.id, confirm.status);
      notice.ok(confirm.status === 'disabled' ? '已禁用该客户，登录会话已失效' : '已启用该客户');
      setConfirm(null);
      const next = await customerApi.list({ q, status, page });
      setData(next);
    } catch (e) {
      notice.err((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) || 1 : 1;

  const backParams = params.toString();
  const detailHref = (id: string | number) => `/admin/customers/${id}${backParams ? `?${backParams}` : ''}`;

  return (
    <AdminPage
      title="客户管理"
      subtitle={data ? `共 ${data.total} 位客户 · 总有 ${data.totalLessons} 个课次` : '查看客户学习进度，管理账号状态'}
    >
      {notice.notice && <Banner tone={notice.notice.tone}>{notice.notice.text}</Banner>}
      {error && <Banner tone="err">{error}</Banner>}

      <Card>
        <div className="admin-toolbar">
          <TextInput
            value={searchDraft}
            onChange={setSearchDraft}
            type="search"
            placeholder="按用户名搜索"
            onKeyDown={(event) => { if (event.key === 'Enter') submitSearch(); }}
          />
          <Select value={status} onChange={(value) => updateParams({ status: value, page: 1 })} options={STATUS_OPTIONS} />
          <Button variant="primary" onClick={submitSearch}><Icon name="search" />搜索</Button>
          {q && <Button variant="ghost" onClick={() => updateParams({ q: '', page: 1 })}>清除搜索</Button>}
        </div>

        {loading ? (
          <Loading />
        ) : !data || data.users.length === 0 ? (
          <Empty>
            {q || status ? '没有符合条件的客户' : '还没有客户注册'}
            {(q || status) && (
              <div className="admin-trash-empty-action">
                <Button onClick={() => { setSearchDraft(''); updateParams({ q: '', status: '', page: 1 }); }}>清除筛选</Button>
              </div>
            )}
          </Empty>
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>用户名</th>
                    <th>状态</th>
                    <th>课次进度</th>
                    <th>待复习</th>
                    <th>最近学习</th>
                    <th>注册时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((row) => {
                    const pct = data.totalLessons ? Math.ceil((row.completed / data.totalLessons) * 100) : 0;
                    return (
                      <tr
                        key={row.id}
                        className="admin-row-clickable"
                        onClick={() => navigate(detailHref(row.id))}
                      >
                        <td>
                          <strong>{row.username}</strong>
                        </td>
                        <td><AccountState status={row.status} /></td>
                        <td style={{ minWidth: 170 }}>
                          <div className="flex spread" style={{ fontSize: 12, marginBottom: 4 }}>
                            <span>{row.completed} / {data.totalLessons}</span>
                            <span className="muted">{pct}%</span>
                          </div>
                          <div className="admin-meter"><i style={{ width: `${pct}%` }} /></div>
                        </td>
                        <td>{row.dueVocab + row.dueSentence} 项</td>
                        <td>{formatTime(row.lastStudyAt)}</td>
                        <td>{formatTime(row.createdAt)}</td>
                        <td onClick={(event) => event.stopPropagation()}>
                          <div className="admin-row-actions">
                            <Link
                              className="admin-icon-btn admin-icon-btn-sky"
                              to={detailHref(row.id)}
                              aria-label={`查看 ${row.username}`}
                              title={`查看 ${row.username}`}
                            >
                              <Icon name="eye" />
                            </Link>
                            <IconButton
                              icon="power"
                              label={row.status === 'normal' ? `禁用 ${row.username}` : `启用 ${row.username}`}
                              tone={row.status === 'normal' ? 'danger' : 'green'}
                              onClick={() => setConfirm({ row, status: row.status === 'normal' ? 'disabled' : 'normal' })}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="admin-pager">
              <IconButton icon="chevron-left" label="上一页" disabled={page <= 1} onClick={() => updateParams({ page: page - 1 })} />
              <span className="muted">第 {page} / {totalPages} 页</span>
              <IconButton icon="chevron-right" label="下一页" disabled={page >= totalPages} onClick={() => updateParams({ page: page + 1 })} />
            </div>
          </>
        )}
      </Card>

      {confirm && (
        <ConfirmDialog
          title={confirm.status === 'disabled' ? '禁用客户' : '启用客户'}
          confirmLabel={confirm.status === 'disabled' ? '确认禁用' : '确认启用'}
          tone={confirm.status === 'disabled' ? 'danger' : 'primary'}
          onConfirm={toggleStatus}
          onClose={() => setConfirm(null)}
          busy={busy}
        >
          <p>
            客户 <strong>{confirm.row.username}</strong>（{confirm.row.id}）当前状态为{confirm.row.status === 'normal' ? '正常' : '已禁用'}。
          </p>
          {confirm.status === 'disabled' ? (
            <p className="muted">禁用后立即退出登录且无法再次登录；学习记录保留，重新启用后恢复。</p>
          ) : (
            <p className="muted">启用后可重新登录，原有学习记录保持不变。</p>
          )}
        </ConfirmDialog>
      )}
    </AdminPage>
  );
}
