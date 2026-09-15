export type Recipe = {
  id: string;
  time: string;
  servings: { el: string; en: string };
  tag: { el: string; en: string };
  title: { el: string; en: string };
  lede: { el: string; en: string };
  ingredients: { el: string; en: string; q: { el: string; en: string } }[];
  steps: { el: string; en: string }[];
  tip: { el: string; en: string };
  image: string;
  // CSS object-position value for the card thumbnail (e.g. "center top",
  // "50% 20%"). Defaults to "center" when omitted. Use this for shots
  // where a bottle is being poured, so the top of the bottle stays visible
  // instead of getting cropped by the fixed aspect-ratio card.
  imagePosition?: string;
};

/* ------------------------------------------------------------------ */
/*  Recipe data — matches the image-generation prompts already drafted */
/*  for this brand. Add /images/recipes/<id>.png for each to go live.  */
/* ------------------------------------------------------------------ */

export const RECIPES: Recipe[] = [
  {
    id: "ladopita",
    time: "60'",
    servings: { el: "12–15 κομμάτια", en: "12–15 pieces" },
    tag: { el: "Παραδοσιακό γλυκό", en: "Traditional dessert" },
    title: { el: "Λαδόπιτα Πρεβέζης", en: "Preveza olive oil cake" },
    lede: {
      el: "Οικογενειακή συνταγή που περνά από χέρι σε χέρι στην Πρέβεζα. Φτιάξτε την μία φορά και θα τη θυμάστε.",
      en: "A family recipe passed down in Preveza. Make it once, and you'll remember it.",
    },
    ingredients: [
      { el: "Ellaina", en: "Ellaina", q: { el: "500ml", en: "500ml" } },
      { el: "Νερό", en: "Water", q: { el: "500ml", en: "500ml" } },
      { el: "Ζάχαρη", en: "Sugar", q: { el: "500ml", en: "500ml" } },
      { el: "Αλεύρι γ.ο.χ.", en: "All-purpose flour", q: { el: "500γρ", en: "500g" } },
      { el: "Σιμιγδάλι ψιλό", en: "Fine semolina", q: { el: "250γρ", en: "250g" } },
      { el: "Φρέσκος χυμός πορτοκαλιού", en: "Fresh orange juice", q: { el: "250ml", en: "250ml" } },
      { el: "Ξύσμα λεμονιού", en: "Lemon zest", q: { el: "1 λεμόνι", en: "1 lemon" } },
      { el: "Αμύγδαλα & σουσάμι", en: "Almonds & sesame", q: { el: "για γαρνίρισμα", en: "for garnish" } },
    ],
    steps: [
      { el: "Προθερμαίνουμε τον φούρνο στους 180°C.", en: "Preheat the oven to 180°C." },
      {
        el: "Σε μεγάλη κατσαρόλα βάζουμε το ελαιόλαδο, το νερό και τη ζάχαρη. Ζεσταίνουμε σε μέτρια φωτιά, ανακατεύοντας μέχρι να λιώσει η ζάχαρη και να πάρει βράση.",
        en: "In a large pot, combine the olive oil, water, and sugar. Heat over medium heat, stirring until the sugar dissolves and it comes to a boil.",
      },
      {
        el: "Προσθέτουμε τον χυμό πορτοκαλιού και το ξύσμα λεμονιού.",
        en: "Add the orange juice and lemon zest.",
      },
      {
        el: "Μόλις ξαναπάρουν βράση τα υλικά, ρίχνουμε το σιμιγδάλι και ανακατεύουμε καλά.",
        en: "Once it returns to a boil, add the semolina and stir well.",
      },
      {
        el: "Προσθέτουμε το αλεύρι και ανακατεύουμε συνεχώς σε μέτρια φωτιά για 5–6 λεπτά, μέχρι να δημιουργηθεί μια κολλώδης μάζα.",
        en: "Add the flour and stir continuously over medium heat for 5–6 minutes, until it forms a sticky mass.",
      },
      {
        el: "Αδειάζουμε το μείγμα σε βαθύ ταψί 30–32εκ. και ισιώνουμε καλά με κουτάλι.",
        en: "Pour the mixture into a deep 30–32cm baking tray and level it well with a spoon.",
      },
      {
        el: "Χαράζουμε το μείγμα με χοντρό μαχαίρι σε τετράγωνα ή ρόμβους.",
        en: "Score the mixture with a thick knife into squares or diamonds.",
      },
      {
        el: "Καρφώνουμε σε κάθε κομμάτι από ένα αμύγδαλο και πασπαλίζουμε με σουσάμι.",
        en: "Press one almond into each piece and sprinkle with sesame seeds.",
      },
      {
        el: "Ψήνουμε στο φούρνο για 50–60 λεπτά, μέχρι να ροδίσει καλά.",
        en: "Bake for 50–60 minutes, until nicely golden.",
      },
      {
        el: "Αφήνουμε τη λαδόπιτα να κρυώσει ελαφρά και σερβίρουμε.",
        en: "Let the cake cool slightly, then serve.",
      },
    ],
    tip: {
      el: "Χάραξε σε ρόμβους πριν ψηθεί, για να κόβεται καθαρά μετά",
      en: "Score into diamonds before baking, so it cuts cleanly afterward",
    },
    image: "/images/recipes/ladopita.png",
    imagePosition: "center",
  },
  {
    id: "briam",
    time: "70'",
    servings: { el: "4 άτομα", en: "4 people" },
    tag: { el: "Λαδερό", en: "Oil-baked" },
    title: { el: "Μπριάμ — Ταψί λαχανικών", en: "Briam — Baked vegetable medley" },
    lede: {
      el: "Τα «λαδερά» λέγονται έτσι επειδή το λάδι δεν είναι γαρνιτούρα — είναι το ίδιο το μαγείρεμα.",
      en: "\"Oil-based\" dishes are named that way because the oil isn't a garnish — it's the cooking itself.",
    },
    ingredients: [
      { el: "Πατάτες", en: "Potatoes", q: { el: "3", en: "3" } },
      { el: "Κολοκυθάκια", en: "Zucchini", q: { el: "3", en: "3" } },
      { el: "Μελιτζάνες", en: "Eggplant", q: { el: "2", en: "2" } },
      { el: "Ντομάτες τριμμένες", en: "Grated tomatoes", q: { el: "2", en: "2" } },
      { el: "Κρεμμύδι", en: "Onion", q: { el: "1", en: "1" } },
      { el: "Ellaina", en: "Ellaina", q: { el: "1/2 φλ.", en: "1/2 cup" } },
      { el: "Ρίγανη, αλάτι, πιπέρι", en: "Oregano, salt, pepper", q: { el: "—", en: "—" } },
    ],
    steps: [
      { el: "Προθερμαίνουμε τον φούρνο στους 200°C.", en: "Preheat the oven to 200°C." },
      {
        el: "Κόβουμε όλα τα λαχανικά σε χοντρές φέτες ή κομμάτια.",
        en: "Cut all the vegetables into thick slices or chunks.",
      },
      {
        el: "Στρώνουμε τα λαχανικά σε ταψί μαζί με τις τριμμένες ντομάτες και το κρεμμύδι.",
        en: "Arrange the vegetables in a baking tray along with the grated tomatoes and onion.",
      },
      {
        el: "Περιχύνουμε γενναιόδωρα με Ellaina και προσθέτουμε ρίγανη, αλάτι και πιπέρι. Ανακατεύουμε καλά ώστε όλα τα κομμάτια να καλυφθούν με λάδι.",
        en: "Drizzle generously with Ellaina and add oregano, salt, and pepper. Toss well so every piece is coated in oil.",
      },
      {
        el: "Ψήνουμε για 60–70 λεπτά, μέχρι τα λαχανικά να μαλακώσουν καλά και οι άκρες να ροδίσουν.",
        en: "Bake for 60–70 minutes, until the vegetables are very soft and the edges are golden.",
      },
      {
        el: "Σερβίρουμε ζεστό ή σε θερμοκρασία δωματίου.",
        en: "Serve warm or at room temperature.",
      },
    ],
    tip: {
      el: "Μη λιγοστέψεις το λάδι — χωρίς αυτό, τα λαχανικά ξεραίνονται",
      en: "Don't skimp on the oil — without it, the vegetables dry out",
    },
    image: "/images/recipes/briam.png",
    imagePosition: "center",
  },
  {
    id: "horiatiki",
    time: "10'",
    servings: { el: "2–3 άτομα", en: "2–3 people" },
    tag: { el: "Σαλάτα", en: "Salad" },
    title: { el: "Χωριάτικη σαλάτα", en: "Greek village salad" },
    lede: {
      el: "Το λάδι δεν είναι συνοδευτικό εδώ — είναι το βασικό συστατικό.",
      en: "The oil isn't a side note here — it's the main ingredient.",
    },
    ingredients: [
      { el: "Ντομάτα ώριμη", en: "Ripe tomato", q: { el: "3", en: "3" } },
      { el: "Αγγούρι", en: "Cucumber", q: { el: "1", en: "1" } },
      { el: "Κρεμμύδι κόκκινο", en: "Red onion", q: { el: "1", en: "1" } },
      { el: "Φέτα σε φέτα", en: "Feta, whole slab", q: { el: "150γρ", en: "150g" } },
      { el: "Ελιές Καλαμών", en: "Kalamata olives", q: { el: "μια χούφτα", en: "a handful" } },
      { el: "Ellaina", en: "Ellaina", q: { el: "4 κ.σ.", en: "4 tbsp" } },
    ],
    steps: [
      { el: "Κόβουμε ντομάτα, αγγούρι και κρεμμύδι σε χοντρά κομμάτια.", en: "Cut the tomato, cucumber, and onion into thick pieces." },
      { el: "Ανακατεύουμε απαλά σε μπολ μαζί με τις ελιές.", en: "Toss gently in a bowl together with the olives." },
      { el: "Τοποθετούμε ολόκληρη τη φέτα από πάνω.", en: "Place the whole slab of feta on top." },
      {
        el: "Πασπαλίζουμε με ρίγανη και περιχύνουμε γενναιόδωρα με Ellaina.",
        en: "Sprinkle with oregano and drizzle generously with Ellaina.",
      },
    ],
    tip: { el: "Το λάδι πάνω στη φέτα, όχι στα λαχανικά", en: "Pour over the feta, not the vegetables" },
    image: "/images/recipes/horiatiki.png",
    imagePosition: "center top",
  },
  {
    id: "dakos",
    time: "8'",
    servings: { el: "1 μερίδα", en: "1 serving" },
    tag: { el: "Κρητική παράδοση", en: "Cretan classic" },
    title: { el: "Ντάκος Κρητικός", en: "Cretan dakos" },
    lede: {
      el: "Το παξιμάδι μαλακώνει μόνο με το λάδι — χωρίς αυτό, δεν τρώγεται.",
      en: "The rusk only softens with the oil — without it, it's inedible.",
    },
    ingredients: [
      { el: "Παξιμάδι κριθαρένιο", en: "Barley rusk", q: { el: "1", en: "1" } },
      { el: "Ντομάτα τριμμένη", en: "Grated tomato", q: { el: "1 μεγάλη", en: "1 large" } },
      { el: "Μυζήθρα ή φέτα", en: "Myzithra or feta", q: { el: "τριμμένη", en: "grated" } },
      { el: "Ellaina", en: "Ellaina", q: { el: "γενναιόδωρα", en: "generously" } },
      { el: "Ρίγανη", en: "Oregano", q: { el: "—", en: "—" } },
    ],
    steps: [
      {
        el: "Βρέχουμε ελαφρά το παξιμάδι με λίγο νερό, ώστε να μαλακώσει χωρίς να λιώσει.",
        en: "Lightly moisten the rusk with a little water, so it softens without falling apart.",
      },
      { el: "Τρίβουμε την ντομάτα και την απλώνουμε από πάνω.", en: "Grate the tomato and spread it on top." },
      { el: "Προσθέτουμε την τριμμένη μυζήθρα ή φέτα.", en: "Add the grated myzithra or feta." },
      {
        el: "Περιχύνουμε γενναιόδωρα με Ellaina και πασπαλίζουμε με ρίγανη.",
        en: "Drizzle generously with Ellaina and sprinkle with oregano.",
      },
      {
        el: "Αφήνουμε 2–3 λεπτά να μουσκέψει το λάδι το παξιμάδι πριν σερβίρουμε.",
        en: "Let the oil soak into the rusk for 2–3 minutes before serving.",
      },
    ],
    tip: { el: "Άφησε το λάδι να μουσκέψει το παξιμάδι πριν σερβίρεις", en: "Let the oil soak in before serving" },
    image: "/images/recipes/dakos.png",
    imagePosition: "center top",
  },
  {
    id: "fish-ladolemono",
    time: "15'",
    servings: { el: "2 άτομα", en: "2 people" },
    tag: { el: "Κυρίως", en: "Main" },
    title: { el: "Ψάρι με λαδολέμονο", en: "Fish with ladolemono" },
    lede: {
      el: "Η θερμότητα θα το θόλωνε — το λαδολέμονο μπαίνει πάντα στο τέλος.",
      en: "Heat would dull it — ladolemono always goes on at the end.",
    },
    ingredients: [
      { el: "Τσιπούρα ή λαβράκι", en: "Sea bream or bass", q: { el: "1", en: "1" } },
      { el: "Ellaina", en: "Ellaina", q: { el: "4 κ.σ.", en: "4 tbsp" } },
      { el: "Χυμός λεμονιού", en: "Lemon juice", q: { el: "1 λεμόνι", en: "1 lemon" } },
      { el: "Ρίγανη ξερή", en: "Dried oregano", q: { el: "—", en: "—" } },
    ],
    steps: [
      {
        el: "Ψήνουμε το ψάρι σκέτο στη σχάρα ή στο φούρνο, μέχρι να ροδίσει καλά το δέρμα.",
        en: "Grill or bake the fish plain, until the skin is nicely golden.",
      },
      {
        el: "Σε ένα μπολ ανακατεύουμε το Ellaina με τον χυμό λεμονιού και τη ρίγανη.",
        en: "In a bowl, whisk together the Ellaina, lemon juice, and oregano.",
      },
      {
        el: "Μόλις το ψάρι βγει από τη φωτιά, το πινελίζουμε γενναιόδωρα με το λαδολέμονο.",
        en: "As soon as the fish comes off the heat, brush it generously with the ladolemono.",
      },
      { el: "Σερβίρουμε αμέσως, όσο είναι ακόμα ζεστό.", en: "Serve immediately, while still warm." },
    ],
    tip: { el: "Πινέλισε το λαδολέμονο εκτός φωτιάς", en: "Brush the ladolemono off the heat" },
    image: "/images/recipes/fish-ladolemono.png",
    imagePosition: "center top",
  },
  {
    id: "hummus",
    time: "12'",
    servings: { el: "4 άτομα", en: "4 people" },
    tag: { el: "Ορεκτικό", en: "Appetizer" },
    title: { el: "Χούμους με Ellaina", en: "Hummus with Ellaina" },
    lede: {
      el: "Το λάδι δεν πέφτει πάνω στο χούμους στο τέλος — ανακατεύεται μέσα του από την αρχή.",
      en: "The oil doesn't just sit on top of the hummus — it's whipped into it from the start.",
    },
    ingredients: [
      { el: "Ρεβίθια βρασμένα", en: "Cooked chickpeas", q: { el: "400γρ", en: "400g" } },
      { el: "Ταχίνι", en: "Tahini", q: { el: "2 κ.σ.", en: "2 tbsp" } },
      { el: "Χυμός λεμονιού", en: "Lemon juice", q: { el: "1 λεμόνι", en: "1 lemon" } },
      { el: "Σκόρδο", en: "Garlic", q: { el: "1 σκελίδα", en: "1 clove" } },
      { el: "Ellaina", en: "Ellaina", q: { el: "5 κ.σ.", en: "5 tbsp" } },
      { el: "Πάπρικα καπνιστή", en: "Smoked paprika", q: { el: "μια πρέζα", en: "a pinch" } },
      { el: "Αλάτι", en: "Salt", q: { el: "—", en: "—" } },
    ],
    steps: [
      {
        el: "Χτυπάμε στο μπλέντερ τα ρεβίθια, το ταχίνι, τον χυμό λεμονιού, το σκόρδο και το αλάτι.",
        en: "Blend the chickpeas, tahini, lemon juice, garlic, and salt together.",
      },
      {
        el: "Με τον μπλέντερ ακόμα σε λειτουργία, προσθέτουμε το Ellaina σε λεπτή ροή, μέχρι το μείγμα να γίνει αφράτο και βελούδινο.",
        en: "With the blender still running, stream in the Ellaina slowly, until the mixture turns light and velvety.",
      },
      {
        el: "Δοκιμάζουμε και διορθώνουμε αλάτι ή λεμόνι αν χρειάζεται.",
        en: "Taste and adjust salt or lemon if needed.",
      },
      {
        el: "Σερβίρουμε σε πιάτο, ανοίγουμε μια λακκούβα στο κέντρο και περιχύνουμε με ακόμα λίγο Ellaina και πάπρικα.",
        en: "Serve on a plate, make a small well in the center, and finish with a little more Ellaina and paprika.",
      },
    ],
    tip: {
      el: "Το λάδι μπαίνει μέσα στο μπλέντερ, όχι μόνο από πάνω στο τέλος",
      en: "The oil goes into the blender, not just on top at the end",
    },
    image: "/images/recipes/hummus.png",
    imagePosition: "center top",
  },
];

export function getRecipeById(id: string): Recipe | undefined {
  return RECIPES.find((r) => r.id === id);
}