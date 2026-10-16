export default function Toast({ msg }) {
  if (!msg?.text) return null;
  return <div className={`alert alert-${msg.type || 'info'} py-2`} role="alert">{msg.text}</div>;
}
