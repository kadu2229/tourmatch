import Image from "next/image";
import styles from "./About.module.css";
import turista_guia from "../../public/img/Turista_guia.png";

const passos = [
  {
    numero: "1",
    titulo: "Conte o que você procura",
    texto: "Informe destino, período, interesses, idioma e orçamento em poucos cliques.",
  },
  {
    numero: "2",
    titulo: "Receba recomendações",
    texto: "O TourMatch compara o seu perfil com o dos guias e mostra os mais compatíveis.",
  },
  {
    numero: "3",
    titulo: "Combine com o guia",
    texto: "Veja perfis e avaliações, demonstre interesse e, havendo interesse dos dois lados, combinem os detalhes.",
  },
];

const vantagens = [
  {
    titulo: "Recomendação personalizada",
    texto: "Em vez de uma busca genérica, você recebe guias escolhidos pela compatibilidade com o seu perfil.",
  },
  {
    titulo: "Perfis e avaliações",
    texto: "Conheça a especialidade, os idiomas e a opinião de outros turistas antes de decidir.",
  },
  {
    titulo: "Tudo em um só lugar",
    texto: "Destino, idioma, orçamento e disponibilidade reunidos, sem pular entre redes sociais e sites.",
  },
  {
    titulo: "Mais visibilidade para guias",
    texto: "Profissionais autônomos alcançam turistas interessados exatamente no que oferecem.",
  },
];

export default function About() {
  return (
    <>
      <section id="about" className={styles.sobre}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            Mais que um passeio, uma viagem com quem <span className={styles.highlight}>conhece o lugar</span>
          </h2>
          <p className={styles.text}>
            O TourMatch conecta turistas a guias que combinam com o seu estilo, o seu idioma e o seu orçamento.
          </p>
          <div className={styles.imageWrapper}>
            <Image
              loading="eager"
              src={turista_guia}
              alt="Ilustração de uma guia turística apresentando um destino a um turista"
              width={1200}
              height={800}
              className={styles.image}
            />
          </div>
        </div>
      </section>

      <div className={styles.duo}>
        <section id="como-funciona" className={styles.como}>
          <div className={styles.comoContainer}>
            <span className={styles.tag}>Como funciona</span>
            <h2 className={styles.comoTitle}>Do desejo de viajar ao guia certo em 3 passos</h2>
            <p className={styles.comoSubtitle}>
              Chega de procurar guias em redes sociais e sites espalhados. O app reúne tudo e faz a busca por você.
            </p>
            <div className={styles.steps}>
              {passos.map((passo) => (
                <article key={passo.numero} className={styles.step}>
                  <span className={styles.number}>{passo.numero}</span>
                  <h3 className={styles.stepTitle}>{passo.titulo}</h3>
                  <p className={styles.stepText}>{passo.texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="vantagens" className={styles.porque}>
          <div className={styles.porqueContainer}>
            <span className={styles.tagAzul}>Por que usar</span>
            <h2 className={styles.porqueTitle}>Uma viagem melhor começa com o guia certo</h2>
            <p className={styles.porqueSubtitle}>
              O TourMatch economiza o seu tempo e valoriza o turismo local, aproximando quem viaja de quem conhece o destino.
            </p>
            <div className={styles.grid}>
              {vantagens.map((item) => (
                <article key={item.titulo} className={styles.card}>
                  <h3 className={styles.cardTitle}>{item.titulo}</h3>
                  <p className={styles.cardText}>{item.texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
