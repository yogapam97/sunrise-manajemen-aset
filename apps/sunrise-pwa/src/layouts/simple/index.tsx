import Header from "../_common/header-simple";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function SimpleLayout({ children }: Props) {
  return (
    <>
      <Header />

      {children}
    </>
  );
}
