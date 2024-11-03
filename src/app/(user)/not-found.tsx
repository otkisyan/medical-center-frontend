import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
  const tNotFoundPage = useTranslations("NotFoundPage");
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
        <h2>{tNotFoundPage("page_not_found_title")}</h2>
        <p>{formattedDate}</p>

        <Link href="/" style={{ textDecoration: "none" }}>
          {tNotFoundPage("home_page_link_label")}
        </Link>
      </div>
    </>
  );
}
