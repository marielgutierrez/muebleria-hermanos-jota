function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <p className="hero__eyebrow">Buenos Aires · Casa Taller</p>

        <h1 className="hero__title">
          El redescubrimiento
          <br />
          de un arte olvidado
        </h1>

        <p className="hero__subtitle">
          Creamos muebles que no solo sirven una función, sino que alimentan el alma.
          Existimos en la intersección entre herencia e innovación, donde la calidez del
          optimismo de los años 60 se encuentra con la conciencia de la sustentabilidad
          de hoy. Cada pieza cuenta una historia de artesanía que honra el pasado
          mientras abraza el futuro.
        </p>

        <div className="hero__actions">
          <a href="#" className="btn btn--primary">Ver productos</a>
          <a href="#" className="btn btn--secondary">Conocé el taller</a>
        </div>
      </div>
    </section>
  );
}

export default Hero;