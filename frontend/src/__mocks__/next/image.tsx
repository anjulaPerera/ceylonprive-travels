import React from "react";

const MockImage = ({
  src,
  alt,
  fill: _fill,
  priority: _priority,
  ...props
}: {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  [key: string]: unknown;
}) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} {...props} />;
};

export default MockImage;