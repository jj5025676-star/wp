import { cn } from '../common/utils';

interface Example {
  id: string;
  title: string;
  imageUrl?: string;
  description?: string;
}

interface ExampleGalleryProps {
  examples: Example[];
}

export function ExampleGallery({ examples }: ExampleGalleryProps) {
  if (!examples.length) return null;

  return (
    <section className="mt-12">
      <h3 className="mb-6 text-2xl font-bold text-foreground">示例</h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {examples.map((example) => (
          <div
            key={example.id}
            className={cn(
              'group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg cursor-pointer'
            )}
          >
            {example.imageUrl && (
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={example.imageUrl}
                  alt={example.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-4">
              <h4 className="font-semibold text-foreground">{example.title}</h4>
              {example.description && (
                <p className="mt-2 text-sm text-muted-foreground">{example.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
