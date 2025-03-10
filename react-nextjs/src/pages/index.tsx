import Head from "next/head";
import Container from "react-bootstrap/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Homepage from "@/components/Homepage";

export default function Home() {
  return (
    <>
      <Head>
        <title>きく</title>
        <meta name="description" content="Listen up!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/android-chrome-192x192.png" />
      </Head>
      <Container as="main" className="py-4 px-3 mx-auto">
        <Header />

        <Homepage />
        

        <Footer />
      </Container>
    </>
  );
}
