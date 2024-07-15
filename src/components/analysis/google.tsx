import Script from "next/script";

export default function GoogleAnalytics() {
  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-FGV7MBZ0R5" />
      {/* <!-- Google tag (gtag.js) --> */}
      <Script>
        {
          `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-FGV7MBZ0R5');
          `
        }
      </Script>
    </>
  )
}