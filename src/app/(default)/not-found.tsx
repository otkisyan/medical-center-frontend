export default function NotFound() {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");

  const formattedDate = `${day}.${month}.${year}, ${hour}:${minute}`;
  return (
    <>
      <br></br>
      <div className="text-center">
        <i className="bi bi-emoji-frown h1"></i>
        <h2>Сторінка не знайдена</h2>
        <p>{formattedDate}</p>
      </div>
    </>
  );
}
