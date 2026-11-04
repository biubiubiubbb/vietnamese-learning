import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  AdminPage,
  Banner,
  Button,
  Card,
  ConfirmDialog,
  Empty,
  Field,
  Icon,
  Loading,
  Modal,
  MoreMenu,
  PasswordInput,
  TextInput,
  useNotice,
} from './ui';
import { customerApi, formatTime, type CustomerDetail } from './customerApi';

function Meter({ value }: { value: number }) {
  return (
    <div className="admin-meter">
      <i style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export default function AdminCustomerDetail() {
  const { id = '' } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const notice = useNotice();

  const [data, setData] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusModal, setStatusModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [modalError, setModalError] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [typedName, setTypedName] = useState('');
  const [showAllLessons, setShowAllLessons] = useState(false);
  const [showAllScores, setShowAllScores] = useState(false);

  const back = `/admin/customers${params.toString() ? `?${params.toString()}` : ''}`;

  const load = () => {
    setLoading(true);
    setError('');
    customerApi
      .detail(id)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const toggleStatus = async () => {
    if (!data) return;
    setBusy(true);
    setModalError('');
    try {
      const next = data.user.status === 'normal' ? 'disabled' : 'normal';
      await customerApi.setStatus(data.user.id, next);
      notice.ok(next === 'disabled' ? '已禁用该客户，登录会话已失效' : '已启用该客户');
      setStatusModal(false);
      load();
    } catch (e) {
      setModalError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async () => {
    if (!data) return;
    setBusy(true);
    setModalError('');
    try {
      await customerApi.resetPassword(data.user.id, password.trim(), confirmPassword.trim());
      notice.ok('密码已重置，该客户的所有登录会话已失效');
      setResetModal(false);
      setPassword('');
      setConfirmPassword('');
    } catch (e) {
      setModalError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!data) return;
    setBusy(true);
    setModalError('');
    try {
      await customerApi.remove(data.user.id, typedName.trim());
      notice.ok('客户已删除');
      navigate(back, { replace: true });
    } catch (e) {
      setModalError((e as Error).message);
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <AdminPage title="客户详情">
        <Loading />
      </AdminPage>
    );
  }

  if (error || !data) {
    return (
      <AdminPage
        title="客户详情"
        actions={<Link className="admin-icon-btn" to={back} aria-label="返回列表" title="返回列表"><Icon name="chevron-left" /></Link>}
      >
        <Banner tone="err">{error || '客户不存在或已被删除'}</Banner>
      </AdminPage>
    );
  }

  const user = data.user;
  const canDelete = typedName.trim().toLowerCase() === user.username.toLowerCase();
  const dueTotal = data.dueVocab + data.dueSentence;
  const normal = user.status === 'normal';
  const lessons = showAllLessons ? data.completedLessons : data.completedLessons.slice(0, 5);
  const scores = showAllScores ? data.scores : data.scores.slice(0, 5);

  return (
    <AdminPage
      title={user.username}
      subtitle={
        <div className="admin-meta-bar">
          <span className={`admin-meta-item ${normal ? 'state-ok' : 'state-off'}`}>
            <Icon name={normal ? 'user' : 'user-off'} />
            {normal ? '账号正常' : '账号已禁用'}
          </span>
          <span className="admin-meta-item" title={String(user.createdAt)}>
            <Icon name="calendar" />
            注册 {formatTime(user.createdAt)}
          </span>
          <span className="admin-meta-item" title={user.lastLoginAt ? String(user.lastLoginAt) : ''}>
            <Icon name="clock" />
            登录 {formatTime(user.lastLoginAt)}
          </span>
          <span className="admin-meta-item" title={user.lastStudyAt ? String(user.lastStudyAt) : ''}>
            <Icon name="book" />
            学习 {formatTime(user.lastStudyAt)}
          </span>
        </div>
      }
      actions={
        <>
          <Link className="admin-icon-btn" to={back} aria-label="返回列表" title="返回列表">
            <Icon name="chevron-left" />
          </Link>
          <Button variant={normal ? 'default' : 'primary'} onClick={() => { setModalError(''); setStatusModal(true); }}>
            {normal ? '禁用账号' : '启用账号'}
          </Button>
          <MoreMenu
            items={[
              { label: '重置密码', icon: 'refresh', onSelect: () => { setModalError(''); setResetModal(true); } },
              { label: '删除客户', icon: 'trash', tone: 'danger', onSelect: () => { setModalError(''); setDeleteModal(true); } },
            ]}
          />
        </>
      }
    >
      {notice.notice && <Banner tone={notice.notice.tone}>{notice.notice.text}</Banner>}

      <div className="admin-stats">
        <div className="admin-stat tone-green">
          <span className="admin-stat-icon"><Icon name="check" /></span>
          <div className="n">{data.completedCount} / {data.totalLessons}</div>
          <div className="l">已完成课次 / 全部课次</div>
        </div>
        <div className="admin-stat tone-sky">
          <span className="admin-stat-icon"><Icon name="wave" /></span>
          <div className="n">{data.completionRate}%</div>
          <div className="l">课次完成率</div>
        </div>
        <div className="admin-stat tone-sun">
          <span className="admin-stat-icon"><Icon name="rule" /></span>
          <div className="n">{data.accuracy === null ? '—' : `${data.accuracy}%`}</div>
          <div className="l">测评平均正确率</div>
        </div>
        <div className="admin-stat tone-pink">
          <span className="admin-stat-icon"><Icon name="clock" /></span>
          <div className="n">{dueTotal}</div>
          <div className="l">待复习（词条 {data.dueVocab} · 句子 {data.dueSentence}）</div>
        </div>
      </div>

      <Card>
        <h3>单元完成度</h3>
        {data.units.length === 0 ? (
          <Empty>暂无单元数据</Empty>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {data.units.map((unit) => (
              <div key={unit.id}>
                <div className="flex spread" style={{ fontSize: 12.5, marginBottom: 5 }}>
                  <span><strong>{unit.title}</strong> <span className="muted">· {unit.level}</span></span>
                  <span className="muted">{unit.done} / {unit.total} 课 · {unit.pct}%</span>
                </div>
                <Meter value={unit.pct} />
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="admin-grid-2" style={{ marginTop: 14 }}>
        <Card>
          <div className="flex spread" style={{ alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>已完成课次</h3>
            {data.completedLessons.length > 5 && (
              <button type="button" className="admin-section-toggle" onClick={() => setShowAllLessons((value) => !value)}>
                <Icon name={showAllLessons ? 'chevron-down' : 'chevron-right'} />
                {showAllLessons ? '收起' : `查看全部 ${data.completedLessons.length}`}
              </button>
            )}
          </div>
          {data.completedLessons.length === 0 ? (
            <Empty>该客户还没有完成任何课次</Empty>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table" style={{ minWidth: 0 }}>
                <thead>
                  <tr><th>课次</th><th>所属单元</th><th>完成时间</th></tr>
                </thead>
                <tbody>
                  {lessons.map((lesson) => (
                    <tr key={lesson.lessonId}>
                      <td>{lesson.title}</td>
                      <td className="muted">{lesson.unitTitle || '—'}</td>
                      <td className="muted">{formatTime(lesson.completedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex spread" style={{ alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>课次测评</h3>
            {data.scores.length > 5 && (
              <button type="button" className="admin-section-toggle" onClick={() => setShowAllScores((value) => !value)}>
                <Icon name={showAllScores ? 'chevron-down' : 'chevron-right'} />
                {showAllScores ? '收起' : `查看全部 ${data.scores.length}`}
              </button>
            )}
          </div>
          {data.scores.length === 0 ? (
            <Empty>该客户还没有测评记录</Empty>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table" style={{ minWidth: 0 }}>
                <thead>
                  <tr><th>课次</th><th>成绩</th><th>正确率</th><th>时间</th></tr>
                </thead>
                <tbody>
                  {scores.map((score) => (
                    <tr key={score.lessonId}>
                      <td>{score.title}</td>
                      <td>{score.correct} / {score.total}</td>
                      <td>{score.rate}%</td>
                      <td className="muted">{formatTime(score.at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h3>复习计划</h3>
        <div className="admin-grid-2">
          {([
            ['词条', data.cards.vocab],
            ['句子', data.cards.sentence],
          ] as const).map(([label, card]) => (
            <div key={label}>
              <div className="flex spread" style={{ fontSize: 13, marginBottom: 8 }}>
                <strong>{label}复习</strong>
                <span className="muted">共 {card.total} 项 · 待复习 {card.due} 项</span>
              </div>
              {card.boxes.map((count, index) => (
                <div key={index} className="flex gap12" style={{ alignItems: 'center', fontSize: 12, marginBottom: 6 }}>
                  <span style={{ width: 42 }}>第 {index + 1} 盒</span>
                  <div style={{ flex: 1 }}><Meter value={card.total ? (count / card.total) * 100 : 0} /></div>
                  <span className="muted" style={{ width: 34, textAlign: 'right' }}>{count}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="muted" style={{ fontSize: 12, marginTop: 10 }}>
          间隔复习：答对进入下一盒（1、2、4、7、15 天），答错回到第 1 盒。管理员只能查看，不能修改客户学习记录。
        </p>
      </Card>

      {statusModal && (
        <ConfirmDialog
          title={normal ? '禁用客户' : '启用客户'}
          confirmLabel={normal ? '确认禁用' : '确认启用'}
          tone={normal ? 'danger' : 'primary'}
          onConfirm={toggleStatus}
          onClose={() => setStatusModal(false)}
          busy={busy}
        >
          {modalError && <Banner tone="err">{modalError}</Banner>}
          {normal ? (
            <p>禁用后客户 <strong>{user.username}</strong> 会立即退出登录且无法再次登录，学习记录会保留。</p>
          ) : (
            <p>启用后客户 <strong>{user.username}</strong> 可以重新登录，原有学习记录保持不变。</p>
          )}
        </ConfirmDialog>
      )}

      {resetModal && (
        <Modal
          title="重置密码"
          onClose={() => (busy ? undefined : setResetModal(false))}
          footer={
            <>
              <Button variant="ghost" onClick={() => setResetModal(false)} disabled={busy}>取消</Button>
              <Button variant="primary" onClick={resetPassword} loading={busy}>确认重置</Button>
            </>
          }
        >
          {modalError && <Banner tone="err">{modalError}</Banner>}
          <p style={{ marginBottom: 14 }}>
            为新密码设置一个值，重置后 <strong>{user.username}</strong> 的所有登录会话会立即失效，需要使用新密码重新登录。
          </p>
          <div style={{ display: 'grid', gap: 12 }}>
            <Field label="新密码" hint="8–64 位，至少含 1 个字母和 1 个数字">
              <PasswordInput value={password} onChange={setPassword} placeholder="输入新密码" />
            </Field>
            <Field label="确认新密码">
              <PasswordInput value={confirmPassword} onChange={setConfirmPassword} placeholder="再次输入新密码" />
            </Field>
          </div>
        </Modal>
      )}

      {deleteModal && (
        <Modal
          title="删除客户"
          onClose={() => (busy ? undefined : setDeleteModal(false))}
          footer={
            <>
              <Button variant="ghost" onClick={() => setDeleteModal(false)} disabled={busy}>取消</Button>
              <Button variant="danger" onClick={remove} disabled={busy || !canDelete} loading={busy}>确认删除</Button>
            </>
          }
        >
          {modalError && <Banner tone="err">{modalError}</Banner>}
          <p className="admin-banner admin-banner-err">
            删除后不可恢复：账号、课次完成记录、测评成绩与复习计划都会被永久删除，用户名可以重新注册。
          </p>
          <Field label={`输入完整用户名 ${user.username} 以确认`}>
            <TextInput value={typedName} onChange={setTypedName} placeholder={user.username} />
          </Field>
        </Modal>
      )}
    </AdminPage>
  );
}
