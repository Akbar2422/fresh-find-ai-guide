
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Utensils, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Recipe {
  name: string;
  steps: string;
  youtube_url: string;
}

interface RecipeSuggestionsProps {
  recipes: Recipe[];
}

const RecipeSuggestions = ({ recipes }: RecipeSuggestionsProps) => {
  if (!recipes || recipes.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Utensils className="h-5 w-5 text-ripe" />
          <span>Recipe Suggestions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recipes.map((recipe, index) => (
          <div key={index} className="space-y-2">
            <h3 className="font-semibold">{recipe.name}</h3>
            <p className="text-sm text-muted-foreground">
              {recipe.steps.length > 200
                ? `${recipe.steps.substring(0, 200)}...`
                : recipe.steps}
            </p>
            {recipe.youtube_url && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => window.open(recipe.youtube_url, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Watch on YouTube
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecipeSuggestions;
