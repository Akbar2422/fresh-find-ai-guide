
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';

type LeaderboardEntry = {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string | null;
  scan_count: number;
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;
        
        // This is a simplified query. In a real app, you would have a proper database structure
        // to track user points and scans, and this would be a more complex query.
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            id,
            name,
            email,
            avatar_url,
            history:history(count)
          `)
          .order('name');
        
        if (error) throw error;
        
        // Transform the data to include scan counts
        const formattedData = data.map((user: any) => ({
          id: user.id,
          name: user.name || user.email?.split('@')[0] || 'Anonymous',
          email: user.email,
          avatar_url: user.avatar_url,
          scan_count: user.history[0]?.count || 0,
        }));
        
        // Sort by scan count descending
        const sortedData = formattedData.sort((a, b) => b.scan_count - a.scan_count);
        
        setLeaderboard(sortedData);
        
        // Find user's rank
        if (userId) {
          const userIndex = sortedData.findIndex(entry => entry.id === userId);
          setUserRank(userIndex !== -1 ? userIndex + 1 : null);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-amber-700" />;
      default:
        return <span className="text-lg font-bold">{rank + 1}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold ml-2">Leaderboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center">
              <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
              Top Fresh Finders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Compete with other users by scanning fresh produce. Each valid scan earns you points towards the leaderboard.
            </p>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-fresh"></div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No entries yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to scan produce and join the leaderboard!
            </p>
            <Button onClick={() => navigate('/')} className="bg-fresh hover:bg-fresh-dark">
              Scan Now
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboard.slice(0, 20).map((entry, index) => (
              <div 
                key={entry.id} 
                className={`flex items-center p-4 bg-white rounded-lg shadow-sm ${
                  userRank === index + 1 ? 'border-2 border-fresh' : ''
                }`}
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  {getRankIcon(index)}
                </div>
                
                <div className="flex-shrink-0 ml-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {entry.avatar_url ? (
                      <img 
                        src={entry.avatar_url} 
                        alt={entry.name || 'User'} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-gray-500">
                        {(entry.name || 'A')[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="ml-4 flex-1">
                  <p className="font-medium">{entry.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {entry.email}
                  </p>
                </div>
                
                <div className="flex-shrink-0 ml-4 text-center">
                  <p className="text-xl font-bold text-fresh">{entry.scan_count}</p>
                  <p className="text-xs text-muted-foreground">scans</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Leaderboard;
