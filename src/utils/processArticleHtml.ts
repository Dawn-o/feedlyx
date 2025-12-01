export function processArticleHtml(bodyHtml: string): string {
  let html = bodyHtml;
  html = html.replace(
    /<img /g,
    '<img loading="lazy" class="rounded-lg shadow-sm" ',
  );
  html = html.replace(
    /<h1>/g,
    '<h1 class="text-4xl font-extrabold mb-6 mt-10 text-foreground leading-tight">',
  );
  html = html.replace(
    /<h2>/g,
    '<h2 class="text-3xl font-bold mb-4 mt-8 text-foreground leading-snug">',
  );
  html = html.replace(
    /<h3>/g,
    '<h3 class="text-2xl font-semibold mb-3 mt-6 text-foreground">',
  );
  html = html.replace(
    /<h4>/g,
    '<h4 class="text-xl font-medium mb-2 mt-4 text-foreground">',
  );
  html = html.replace(
    /<h5>/g,
    '<h5 class="text-lg font-medium mb-2 mt-3 text-foreground">',
  );
  html = html.replace(
    /<h6>/g,
    '<h6 class="text-base font-medium mb-1 mt-2 text-foreground">',
  );
  html = html.replace(
    /<p>/g,
    '<p class="mb-6 leading-loose text-foreground text-base">',
  );
  html = html.replace(
    /<ul>/g,
    '<ul class="mb-6 pl-8 list-disc text-foreground space-y-1">',
  );
  html = html.replace(
    /<ol>/g,
    '<ol class="mb-6 pl-8 list-decimal text-foreground space-y-1">',
  );
  html = html.replace(/<li>/g, '<li class="leading-relaxed">');
  html = html.replace(
    /<blockquote>/g,
    '<blockquote class="border-l-4 border-primary pl-6 italic mb-6 text-foreground bg-muted/30 p-4 rounded-r-lg shadow-sm">',
  );
  html = html.replace(/<pre>/g, '<pre class="mb-6 overflow-x-auto">');
  html = html.replace(/<code>/g, '<code class="mb-6 font-mono text-sm">');
  html = html.replace(
    /<a /g,
    '<a class="text-primary hover:text-primary/80 transition-colors duration-200 underline decoration-2 underline-offset-2" ',
  );
  html = html.replace(/<hr>/g, '<hr class="my-10 h-px">');
  html = html.replace(
    /<strong>/g,
    '<strong class="font-semibold text-foreground">',
  );
  html = html.replace(/<em>/g, '<em class="italic text-muted-foreground">');
  return html;
}
