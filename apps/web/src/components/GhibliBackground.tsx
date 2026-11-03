/**
 * 全站背景：吉卜力山丘插画 + 纸色薄纱，保证正文可读。
 * 图片固定铺满视口，滚动时保持不动。
 */
export default function GhibliBackground() {
  return (
    <div className="ghibli-bg" aria-hidden="true">
      <div className="ghibli-sky" />
      <div className="ghibli-veil" />
    </div>
  );
}
