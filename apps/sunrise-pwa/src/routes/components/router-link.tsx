import type { LinkProps } from "next/link";

import Link from "next/link";
import { forwardRef } from "react";

// ----------------------------------------------------------------------

const RouterLink = forwardRef<HTMLAnchorElement, LinkProps>(({ ...other }, ref) => (
  <Link ref={ref} {...other} />
));

export default RouterLink;
