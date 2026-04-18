import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Shield, Heart, Users } from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "Farm Fresh",
    text: "Every product is sourced directly from our own farmland — no middlemen, no warehouses.",
  },
  {
    icon: Shield,
    title: "No Chemicals",
    text: "We use zero preservatives, pesticides or artificial colors. What you get is 100% natural.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    text: "Our recipes are rooted in tradition, passed down through generations of our family.",
  },
  {
    icon: Users,
    title: "Community First",
    text: "We support local farmers and create livelihood opportunities in our village.",
  },
];

const About = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-linear-to-br from-primary/10 via-accent to-secondary/30 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Our Story</h1>
          <p className="text-lg text-muted-foreground">
            From a small family farm in rural India to your dining table —
            here's how Vivek's Farm came to be.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          Vivek's Farm started as a dream to bring the pure, unadulterated
          flavors of traditional Indian food to homes across the country.
          Growing up on a farm, we witnessed the difference between commercially
          processed food and what nature intended.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Today, we produce ghee using the ancient bilona method, press oils in
          wooden mills, sun-dry our pickles the old-fashioned way, and grind our
          spice powders fresh. Every product that leaves our farm carries the
          taste of authenticity and the warmth of home.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          We started by selling to friends and family through WhatsApp and
          Instagram. The love and trust we received inspired us to build this
          platform — so more families can experience the goodness of farm-fresh
          food.
        </p>
      </section>

      {/* Values */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {values.map((v) => (
              <Card key={v.title}>
                <CardContent className="p-6 flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{v.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {v.text}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
