export default function DefaultLayout({ Header, Footer, Main }) {
  return (
    <div>
      <div>{Header}</div>
      <div>{Main}</div>
      <div>{Footer}</div>
    </div>
  );
}