"use client";

import Image from "next/image";
import Lottie from "lottie-react";
import Card from "./Card";
import logo from "@/../assets/logo.png";
import verification from "@/../assets/verification.json";

export default function Slider() {
  return (
    <div
      className="
        w-full
        flex
        overflow-x-auto
        overflow-y-hidden
        snap-x snap-mandatory
        scroll-smooth
        touch-pan-x
      "
    >
      <Card
        title="Welkom!"
        image={
          <Image src={logo} alt="Logo van de Piwo app!" className="w-40 h-40" />
        }
        description="Welkom bij de kennismaking van de Piwo app!"
        color="bg-pastelOrange"
      />
      <Card
        title="Aanwezigheid"
        image={
          <Lottie animationData={verification} className="w-40 h-40" loop />
        }
        description={
          "In deze app kun je makkelijk je aanwezigheid opgeven en die van anderen bezichtigen"
        }
        color="bg-pastelBlue"
      />
      <Card
        title="Verificatie"
        image={
          <Lottie animationData={verification} className="w-40 h-40" loop />
        }
        description="Voordat je toegang krijgt tot de app, moet je account eerst goedgekeurd worden. Dit kan een paar dagen duren."
        color="bg-pastelPurple"
      />
    </div>
  );
}
