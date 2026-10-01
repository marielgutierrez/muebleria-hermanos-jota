function Hero({ eyebrow, titulo, subtitulo, compacto = false, children }) {
  return (
    <section className={`hero ${compacto ? "hero--compact" : ""}`}>
      <div className="container hero__inner">
        {eyebrow && <p className="hero__eyebrow">{eyebrow}</p>}
        <h1 className="hero__title">{titulo}</h1>
        {subtitulo && <p className="hero__subtitle">{subtitulo}</p>}
        {children && <div className="hero__actions">{children}</div>}
      </div>
    </section>
  );
}

export default Hero;