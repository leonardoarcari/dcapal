import { NavBar } from "@components/core/navBar";
import { DcaPalHelmet } from "./helmet.jsx";
import { Footer } from "@components/core/footer";
import { CookieButton } from "@components/core/cookieButton";
import CookieConsent from "@components/core/cookieConsent";

export const ContainerPage = ({ id, title, content }) => {
  const cookieButtonEnabled  = Number(import.meta.env.VITE_ENABLE_COOKIE_BUTTON) === 1
  return (
    <>
      <DcaPalHelmet id={id} title={title} />
      <div className="w-full h-dvh">
        <div className="h-full flex flex-col items-center">
          <NavBar />
          {content}
          <Footer />
          {cookieButtonEnabled && (
            <CookieButton />
          )}
        </div>
        {cookieButtonEnabled && (
          <CookieConsent />
        )}
      </div>
    </>
  );
};
