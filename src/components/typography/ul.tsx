function ul(props: React.HtmlHTMLAttributes<HTMLUListElement>) {
  return <ul className="my-4 ml-4 list-disc [&>li]:mt-2" {...props} />;
}

export default ul;