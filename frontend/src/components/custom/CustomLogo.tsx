import { Link } from "react-router";


interface Props {
  subtitle?: string;
}

export const CustomLogo = ({ subtitle = 'UAGRM' }: Props) => {
  return (
    <Link
      to="/"
      className="d-flex align-items-center text-decoration-none"
      style={{ gap: '0.5rem' }}
    >
      {/* Nombre principal */}
      {/* <span
        className="fw-bold fs-6 text-danger m-0"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        SOE
      </span> */}

      {/* Logo institucional */}
      <img
        src="https://soeuagrm.edu.bo/web/image/website/1/logo/SOE%20UAGRM?unique=f4c16a0"
        alt="SOE UAGRM"
        width="90"
        height="38"
        className="img-fluid"
        loading="lazy"
        title="SOE UAGRM"
      />

      {/* Subtítulo */}
      <span className="text-secondary small fw-medium">
        {subtitle}
        </span>
    </Link>
  );
};
