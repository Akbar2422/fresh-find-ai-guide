
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { FoodHistory } from '@/lib/supabase';

const History = () => {
  const [history, setHistory] = useState<FoodHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        navigate('/auth');
        return;
      }
      
      setUser(data.user);
      fetchHistory(data.user.id);
    };

    getUser();
  }, [navigate]);

  const fetchHistory = async (userId: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('history')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        variant: "destructive",
        title: "Failed to load history",
        description: "Could not retrieve your scan history.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('history')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setHistory(history.filter(item => item.id !== id));
      
      toast({
        title: "Item deleted",
        description: "The item has been removed from your history.",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Could not delete the item.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good':
        return 'bg-fresh text-white';
      case 'Average':
        return 'bg-ripe text-white';
      case 'Bad':
        return 'bg-apple text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Scan History</h1>
          </div>
          
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fetchHistory(user.id)}
              disabled={loading}
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-fresh"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No scan history yet</h3>
            <p className="text-muted-foreground mb-6">
              Your scanned items will appear here.
            </p>
            <Button onClick={() => navigate('/')} className="bg-fresh hover:bg-fresh-dark">
              Scan Now
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item) => (
              <Card key={item.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video relative">
                  <img 
                    src={item.image_url || '/placeholder.svg'} 
                    alt={item.item_name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className={`absolute top-2 right-2 ${getStatusColor(item.status)}`}>
                    {item.status}
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{item.item_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{formatDate(item.date)}</p>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <p className="text-sm line-clamp-2">{item.quality_reason}</p>
                </CardContent>
                
                <CardFooter className="flex justify-between pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate(`/detail/${item.id}`)}
                  >
                    View Details
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
