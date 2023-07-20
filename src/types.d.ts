type SVGElement = {
  viewBox?: string;
  fill?: string;
  stroke?: string;
  xmlns?: string;
};

type SVGPathElement = {
  d?: string;
  fill?: string;
  stroke?: string;
};

declare namespace JSX {
  interface HtmlTag {
    _?: string;
  }

  interface IntrinsicElements {
    svg: HtmlTag & SVGElement;
    path: HtmlTag & SVGPathElement;
    summary: HtmlTag;
  }
}
