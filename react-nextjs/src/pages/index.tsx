import Head from "next/head";
import Container from "react-bootstrap/Container";
import AppGuides from "@/components/AppGuides";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Homepage from "@/components/Homepage";

export default function Home() {
  return (
    <>
      <Head>
        <title>きく</title>
        <meta name="description" content="上げ your 聞く today!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/android-chrome-192x192.png" />
      </Head>
      <Container as="main" className="py-4 px-3 mx-auto">
        <Header />

        <h1>Kiku</h1>

        <Homepage />

        <hr className="col-1 my-5 mx-0" />

        <AppGuides />
        <Footer />
      </Container>
    </>
  );
}
