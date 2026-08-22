import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const SLIDES = [
  {
    img: "/img/sena-logo.jpg",
    alt: "Logotipo institucional del SENA",
    caption:
      "Servicio Nacional de Aprendizaje — SENA. Marco institucional del proyecto productivo.",
  },
  {
    img: "/img/aprendizaje-ingles.png",
    alt: "Cuatro habilidades del idioma",
    caption:
      "Cuatro habilidades del idioma: listening, speaking, reading y writing, integradas en la ruta lúdica.",
  },
  {
    img: "/img/sede-institucion.jpg",
    alt: "Institución Educativa Gonzalo Rivera Laguardo",
    caption:
      "Sede Institución Educativa Gonzalo Rivera Laguardo, escenario de validación del prototipo.",
  },
];

const MODULES = [
  {
    n: "01",
    title: "Alphabet",
    focus: "Reconocimiento del código alfabético",
    activity: "Emparejamiento letra – palabra referente",
    outcome: "Asociar 6 grafemas con vocabulario visual.",
  },
  {
    n: "02",
    title: "Numbers",
    focus: "Numeración 1 a 10",
    activity: "Emparejamiento numeral – nombre en inglés",
    outcome: "Escribir y leer los numerales cardinales básicos.",
  },
  {
    n: "03",
    title: "Colors",
    focus: "Vocabulario cromático",
    activity: "Selección del color a partir de la palabra",
    outcome: "Identificar 8 colores primarios y secundarios.",
  },
  {
    n: "04",
    title: "Animals",
    focus: "Léxico de animales domésticos y salvajes",
    activity: "Memoria visual (matching pairs)",
    outcome: "Fijar 6 sustantivos de alta frecuencia.",
  },
  {
    n: "05",
    title: "Family",
    focus: "Núcleo familiar y parentesco",
    activity: "Emparejamiento representación – palabra",
    outcome: "Nombrar 6 miembros de la familia.",
  },
  {
    n: "06",
    title: "Food",
    focus: "Léxico alimentario cotidiano",
    activity: "Quiz de opción múltiple con imágenes",
    outcome: "Discriminar 8 términos alimentarios.",
  },
  {
    n: "07",
    title: "Final Quiz",
    focus: "Evaluación transversal",
    activity: "10 preguntas de opción múltiple",
    outcome:
      "Consolidar el vocabulario visto y evidenciar el desempeño global.",
  },
];

const REFERENCES = [
  {
    author: "Krashen, S. D.",
    year: "1982",
    work: "Principles and Practice in Second Language Acquisition",
    place: "Pergamon Press",
    note: "Hipótesis del input comprensible: fundamento del enfoque visual del prototipo.",
  },
  {
    author: "Vygotsky, L. S.",
    year: "1978",
    work: "Mind in Society: The Development of Higher Psychological Processes",
    place: "Harvard University Press",
    note: "Zona de desarrollo próximo aplicada al andamiaje entre niveles.",
  },
  {
    author: "Piaget, J.",
    year: "1962",
    work: "Play, Dreams and Imitation in Childhood",
    place: "W. W. Norton",
    note: "El juego como estructura cognitiva primaria en la primera infancia.",
  },
  {
    author: "Ministerio de Educación Nacional",
    year: "2014",
    work: "Colombia Bilingüe – Programa Nacional de Bilingüismo",
    place: "Bogotá, MEN",
    note: "Política pública que enmarca el aprendizaje temprano del inglés.",
  },
  {
    author: "SENA",
    year: "2022",
    work: "Guía para el desarrollo de proyectos productivos",
    place: "Servicio Nacional de Aprendizaje",
    note: "Lineamientos institucionales del proyecto formativo.",
  },
];

export default function Landing() {
  const nav = useNavigate();
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);

  const move = (dir) => setIdx((i) => (i + dir + SLIDES.length) % SLIDES.length);
  const goTo = (i) => setIdx(i);

  useEffect(() => {
    timer.current = setInterval(() => move(1), 5500);
    return () => clearInterval(timer.current);
    // `move` is stable per-render and depends only on setIdx (React state setter).
    // Rebinding this interval on every render would restart the carousel constantly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <section data-testid="landing-page">
        {/* ---------- HERO / COVER ---------- */}
        <div className="hero-block">
          <div className="eyebrow">Proyecto productivo · SENA</div>
          <h1>
            English Kids — una ruta lúdica para el <em>primer contacto</em> con el inglés
          </h1>
          <p>
            Prototipo web educativo para el fortalecimiento del vocabulario inicial en lengua
            inglesa, dirigido a estudiantes de primera infancia y primaria temprana. Producto
            formativo desarrollado en el marco del programa técnico del Servicio Nacional de
            Aprendizaje.
          </p>
          <div className="hero-ctas">
            <button
              className="btn btn-primary"
              onClick={() => nav("/map")}
              data-testid="hero-cta-map"
            >
              Ir al mapa de niveles →
            </button>
            <button
              className="btn btn-outline"
              style={{ borderColor: "rgba(241,243,236,.4)", color: "var(--paper)" }}
              onClick={() =>
                document.getElementById("dossier")?.scrollIntoView({ behavior: "smooth" })
              }
              data-testid="hero-cta-info"
            >
              Leer la ficha técnica
            </button>
            <button
              className="btn btn-outline"
              style={{ borderColor: "rgba(184,146,46,.5)", color: "var(--gold-soft)" }}
              onClick={() => window.print()}
              data-testid="hero-cta-print"
            >
              Descargar PDF ↓
            </button>
          </div>
        </div>

        {/* ---------- COVER META CARD ---------- */}
        <div className="dossier">
          <div className="cover-card">
            <div className="cover-title">
              <span className="section-eyebrow">Documento del proyecto</span>
              <h2>English Kids</h2>
              <div className="cover-sub">
                Aprendizaje del inglés a través del juego para primera infancia
              </div>
            </div>
            <dl className="cover-meta">
              <div><dt>Modalidad</dt><dd>Proyecto productivo</dd></div>
              <div><dt>Institución</dt><dd>Servicio Nacional de Aprendizaje — SENA</dd></div>
              <div><dt>Sede de aplicación</dt><dd>I. E. Gonzalo Rivera Laguardo</dd></div>
              <div><dt>Público objetivo</dt><dd>Niños y niñas de 5 a 9 años</dd></div>
              <div><dt>Categorías léxicas</dt><dd>6 (más un módulo evaluativo)</dd></div>
              <div><dt>Estado</dt><dd>Prototipo funcional v1</dd></div>
            </dl>
          </div>

          {/* ---------- INDEX ---------- */}
          <div className="index-card" id="dossier">
            <div className="section-eyebrow">Índice del documento</div>
            <ol className="index-list">
              <li><a href="#s1">Contexto y planteamiento</a><span>01</span></li>
              <li><a href="#s2">Justificación</a><span>02</span></li>
              <li><a href="#s3">Objetivo general</a><span>03</span></li>
              <li><a href="#s4">Objetivos específicos</a><span>04</span></li>
              <li><a href="#s5">Marco teórico</a><span>05</span></li>
              <li><a href="#s6">Público objetivo y alcance</a><span>06</span></li>
              <li><a href="#s7">Estructura metodológica</a><span>07</span></li>
              <li><a href="#s8">Competencias abordadas</a><span>08</span></li>
              <li><a href="#s9">Resultados esperados</a><span>09</span></li>
              <li><a href="#s10">Referencias</a><span>10</span></li>
            </ol>
          </div>

          {/* ---------- GALLERY ---------- */}
          <div className="carousel" data-testid="dossier-carousel">
            <div
              className="carousel-viewport"
              onMouseEnter={() => clearInterval(timer.current)}
              onMouseLeave={() => (timer.current = setInterval(() => move(1), 5500))}
            >
              <div
                className="carousel-track"
                style={{ transform: `translateX(-${idx * 100}%)` }}
              >
                {SLIDES.map((s) => (
                  <div className="carousel-slide" key={s.img}>
                    <img src={s.img} alt={s.alt} />
                  </div>
                ))}
              </div>
              <button
                className="carousel-btn prev"
                onClick={() => move(-1)}
                aria-label="Anterior"
                data-testid="carousel-prev"
              >‹</button>
              <button
                className="carousel-btn next"
                onClick={() => move(1)}
                aria-label="Siguiente"
                data-testid="carousel-next"
              >›</button>
            </div>
            <div className="carousel-caption">
              <span className="tag">Galería institucional</span>
              <p data-testid="carousel-caption">{SLIDES[idx].caption}</p>
            </div>
            <div className="carousel-dots">
              {SLIDES.map((s, i) => (
                <button
                  key={s.img}
                  className={i === idx ? "active" : ""}
                  onClick={() => goTo(i)}
                  aria-label={`Ir a la imagen ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ---------- SECTION 01 · CONTEXT ---------- */}
          <article className="doc-section" id="s1">
            <div className="doc-num">01</div>
            <div>
              <h3>Contexto y planteamiento del problema</h3>
              <p>
                Colombia enfrenta un rezago sostenido en dominio del inglés según los índices
                internacionales de proficiencia (EF EPI, EF SET) y las pruebas Saber 11 en la
                sección de lengua extranjera. Este rezago no se explica únicamente por variables
                socioeconómicas: influye de manera decisiva el retraso en la edad de exposición al
                idioma. La literatura en adquisición de lenguas coincide en que la ventana óptima
                para incorporar vocabulario y patrones fonológicos ocurre entre los 3 y los 10
                años de edad.
              </p>
              <p>
                En instituciones educativas oficiales, particularmente en zonas rurales o de
                estratos 1 y 2, el estudiante llega a sexto grado con un contacto formal casi nulo
                con la lengua inglesa. Los materiales existentes suelen ser genéricos, extranjeros
                o dependen de conectividad estable y dispositivos de gama alta.
              </p>
              <p>
                <em>English Kids</em> se plantea como respuesta pragmática a esta brecha: un
                recurso digital ligero, en español-inglés, que introduce vocabulario mediante
                microjuegos y pistas visuales, sin exigir lectura fluida ni instalaciones
                complejas.
              </p>
            </div>
          </article>

          {/* ---------- SECTION 02 · JUSTIFICATION ---------- */}
          <article className="doc-section" id="s2">
            <div className="doc-num">02</div>
            <div>
              <h3>Justificación</h3>
              <p>
                La evidencia pedagógica en adquisición de segundas lenguas sostiene que el
                aprendizaje temprano y contextualizado en juego produce mayor retención que la
                enseñanza formal basada en gramática explícita. Krashen (1982) demuestra que el
                aporte de input comprensible — palabras respaldadas por imagen y contexto — reduce
                el filtro afectivo del estudiante e incrementa la fluidez receptiva.
              </p>
              <blockquote className="pull-quote">
                <p>
                  «Los niños aprenden una segunda lengua más por exposición significativa que por
                  instrucción explícita; el juego funciona como andamiaje cognitivo natural.»
                </p>
                <footer>— Adaptado de Krashen, S. (1982)</footer>
              </blockquote>
              <p>
                En términos institucionales, este proyecto responde al lineamiento del <strong>
                Programa Nacional de Bilingüismo</strong> (MEN, 2014) y al enfoque productivo del
                SENA, que exige a los aprendices resolver una necesidad real del entorno mediante
                un producto o servicio verificable.
              </p>
            </div>
          </article>

          {/* ---------- SECTION 03 · OBJECTIVE ---------- */}
          <article className="doc-section" id="s3">
            <div className="doc-num">03</div>
            <div>
              <h3>Objetivo general</h3>
              <p>
                Facilitar el primer acercamiento de los niños y niñas al idioma inglés mediante un
                recurso web interactivo que integre siete módulos lúdicos progresivos, orientados
                al reconocimiento visual y auditivo de vocabulario básico de alta frecuencia, en
                un entorno seguro, visual y de bajo requerimiento técnico.
              </p>
            </div>
          </article>

          {/* ---------- SECTION 04 · SPECIFIC OBJECTIVES ---------- */}
          <article className="doc-section" id="s4">
            <div className="doc-num">04</div>
            <div>
              <h3>Objetivos específicos</h3>
              <ul className="obj-list">
                <li>
                  Diseñar seis módulos temáticos que aborden alfabeto, numeración, cromatismo,
                  fauna, familia y alimentación.
                </li>
                <li>
                  Implementar un séptimo módulo evaluativo que consolide el vocabulario introducido.
                </li>
                <li>
                  Establecer un sistema de progresión secuencial con retroalimentación inmediata,
                  puntaje y estrellas de desempeño.
                </li>
                <li>
                  Ofrecer una interfaz gráfica sobria, coherente con la identidad SENA, legible en
                  dispositivos de gama baja y compatible con navegadores estándar.
                </li>
                <li>
                  Persistir el avance del estudiante bajo una cuenta personal, para permitir
                  interrupciones y retomas sin pérdida de datos.
                </li>
              </ul>
            </div>
          </article>

          {/* ---------- SECTION 05 · FRAMEWORK ---------- */}
          <article className="doc-section" id="s5">
            <div className="doc-num">05</div>
            <div>
              <h3>Marco teórico</h3>
              <p>
                El diseño pedagógico del prototipo se apoya en tres corrientes que se
                complementan:
              </p>
              <div className="sub-block">
                <div className="sub-title">a. Input comprensible — Stephen Krashen (1982)</div>
                <p>
                  El vocabulario se presenta con soporte visual (emoji, ilustración) y respaldo
                  léxico en español, de modo que la nueva palabra ingresa asociada a un referente
                  concreto. Esto opera como <em>i + 1</em>: material ligeramente por encima del
                  nivel actual, pero comprensible por contexto.
                </p>
              </div>
              <div className="sub-block">
                <div className="sub-title">b. Andamiaje cognitivo — Lev Vygotsky (1978)</div>
                <p>
                  Los siete niveles operan como zonas de desarrollo próximo consecutivas. Cada
                  módulo desbloquea el siguiente, garantizando que el estudiante consolide
                  vocabulario antes de escalar a nuevas categorías. La retroalimentación inmediata
                  (correcto/incorrecto con la respuesta correcta) suple parcialmente al mediador
                  humano.
                </p>
              </div>
              <div className="sub-block">
                <div className="sub-title">c. Juego como estructura cognitiva — Jean Piaget (1962)</div>
                <p>
                  En primera infancia el juego no es un adorno pedagógico: es la forma primaria de
                  cognición. El emparejamiento, la memoria visual y el quiz cronometrado suave
                  responden a esquemas naturales de exploración del entorno.
                </p>
              </div>
              <aside className="side-note">
                <strong>Nota.</strong> El prototipo prescinde de instrucción gramatical explícita:
                se asume que la sintaxis se adquirirá en etapas posteriores del currículo. En esta
                etapa, la meta es exclusivamente léxico-fonológica.
              </aside>
            </div>
          </article>

          {/* ---------- SECTION 06 · SCOPE ---------- */}
          <article className="doc-section" id="s6">
            <div className="doc-num">06</div>
            <div>
              <h3>Público objetivo y alcance</h3>
              <p>
                El destinatario principal es el estudiante de transición, primero y segundo de
                primaria (5 a 9 años). En segundo lugar, se orienta a docentes de básica primaria
                que requieran material de apoyo en aula, y a acudientes que deseen reforzar el
                aprendizaje del inglés desde el hogar.
              </p>
              <p>
                El alcance del prototipo se limita a vocabulario receptivo (reconocimiento) y no
                pretende evaluar producción oral. Tampoco constituye reemplazo del docente: se
                propone como recurso complementario dentro de un plan de aula.
              </p>
            </div>
          </article>

          {/* ---------- SECTION 07 · METHODOLOGY / MODULE TABLE ---------- */}
          <article className="doc-section" id="s7">
            <div className="doc-num">07</div>
            <div>
              <h3>Estructura metodológica</h3>
              <p>
                La ruta lúdica se organiza en siete módulos secuenciales. Cada módulo aborda una
                categoría léxica cerrada y presenta un formato de actividad distinto para
                sostener la atención del estudiante.
              </p>
              <div className="table-wrap">
                <table className="ek-table">
                  <thead>
                    <tr>
                      <th>Nº</th>
                      <th>Módulo</th>
                      <th>Enfoque léxico</th>
                      <th>Actividad</th>
                      <th>Resultado esperado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MODULES.map((m) => (
                      <tr key={m.n}>
                        <td className="num">{m.n}</td>
                        <td className="strong">{m.title}</td>
                        <td>{m.focus}</td>
                        <td>{m.activity}</td>
                        <td>{m.outcome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </article>

          {/* ---------- SECTION 08 · COMPETENCIAS ---------- */}
          <article className="doc-section" id="s8">
            <div className="doc-num">08</div>
            <div>
              <h3>Competencias del programa abordadas</h3>
              <p>
                En la estructura del programa formativo del SENA, este proyecto aporta evidencias
                verificables sobre las siguientes competencias transversales y específicas:
              </p>
              <ul className="obj-list">
                <li>
                  <strong>Análisis de necesidad.</strong> Diagnóstico del rezago en inglés en
                  educación básica y priorización de vocabulario de alta frecuencia.
                </li>
                <li>
                  <strong>Diseño e implementación.</strong> Desarrollo de una aplicación web
                  cliente-servidor con autenticación, persistencia de datos y siete microjuegos
                  interactivos.
                </li>
                <li>
                  <strong>Trabajo colaborativo.</strong> Coordinación entre roles de diseño,
                  desarrollo y validación pedagógica.
                </li>
                <li>
                  <strong>Comunicación técnica.</strong> Documentación del proyecto en un formato
                  presentable a jurados académicos e institucionales.
                </li>
              </ul>
            </div>
          </article>

          {/* ---------- SECTION 09 · RESULTS ---------- */}
          <article className="doc-section" id="s9">
            <div className="doc-num">09</div>
            <div>
              <h3>Resultados esperados</h3>
              <div className="stats-row">
                <div className="stat">
                  <div className="stat-num">7</div>
                  <div className="stat-lbl">módulos secuenciales</div>
                </div>
                <div className="stat">
                  <div className="stat-num">≈40</div>
                  <div className="stat-lbl">palabras introducidas</div>
                </div>
                <div className="stat">
                  <div className="stat-num">3</div>
                  <div className="stat-lbl">estrellas por módulo</div>
                </div>
                <div className="stat">
                  <div className="stat-num">5–9</div>
                  <div className="stat-lbl">edad objetivo (años)</div>
                </div>
              </div>
              <p>
                Al completar la ruta, se espera que el estudiante reconozca de forma visual y
                escrita cerca de cuarenta unidades léxicas distribuidas en seis categorías,
                obtenga puntaje verificable en el módulo evaluativo y consolide una experiencia
                positiva de primer contacto con el idioma.
              </p>
              <p>
                A mediano plazo, se prevé escalar el prototipo con audios reales grabados con
                hablantes nativos, integración con contenido curricular del MEN y un panel para
                docentes que permita revisar el desempeño por grupo.
              </p>
            </div>
          </article>

          {/* ---------- SECTION 10 · REFERENCES ---------- */}
          <article className="doc-section" id="s10">
            <div className="doc-num">10</div>
            <div>
              <h3>Referencias</h3>
              <ol className="ref-list">
                {REFERENCES.map((r) => (
                  <li key={`${r.author}-${r.year}`}>
                    <span className="ref-author">{r.author}</span>{" "}
                    <span className="ref-year">({r.year}).</span>{" "}
                    <em>{r.work}</em>. {r.place}.
                    <div className="ref-note">{r.note}</div>
                  </li>
                ))}
              </ol>
            </div>
          </article>

          <div className="doc-closing">
            <div className="section-eyebrow">Fin del documento</div>
            <p className="closing-line">
              English Kids · Aprendizaje del inglés a través del juego
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                className="btn btn-primary"
                onClick={() => nav("/map")}
                data-testid="cta-goto-map"
              >
                Ir al mapa de niveles →
              </button>
              <button
                className="btn btn-outline"
                onClick={() => window.print()}
                data-testid="cta-print-pdf"
              >
                Descargar en PDF ↓
              </button>
            </div>
          </div>
        </div>

        <footer className="ek-footer">
          <strong>English Kids</strong> · Proyecto productivo SENA · Institución Educativa
          Gonzalo Rivera Laguardo
        </footer>
      </section>
    </>
  );
}
