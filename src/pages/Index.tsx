import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

const END_DATE = new Date('2026-01-08T15:00:00');

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [votes, setVotes] = useState({ angels: 0, demons: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isVotingEnded, setIsVotingEnded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = END_DATE.getTime() - now.getTime();

      if (difference <= 0) {
        setIsVotingEnded(true);
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVote = (side: 'angels' | 'demons') => {
    if (hasVoted || isVotingEnded) return;
    setVotes(prev => ({ ...prev, [side]: prev[side] + 1 }));
    setHasVoted(true);
  };

  const totalVotes = votes.angels + votes.demons;
  const angelsPercent = totalVotes > 0 ? Math.round((votes.angels / totalVotes) * 100) : 0;
  const demonsPercent = totalVotes > 0 ? Math.round((votes.demons / totalVotes) * 100) : 0;

  const winner = votes.angels > votes.demons ? 'angels' : votes.demons > votes.angels ? 'demons' : 'tie';

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              BRAWL BATTLE
            </h1>
            <div className="flex gap-2 md:gap-4">
              {['home', 'vote', 'results', 'video'].map(section => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all ${
                    activeSection === section
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  {section === 'home' && 'Главная'}
                  {section === 'vote' && 'Голосование'}
                  {section === 'results' && 'Результаты'}
                  {section === 'video' && 'Видео'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12">
        {activeSection === 'home' && (
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center mb-16 animate-fade-in">
              <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                ЭПИЧЕСКОЕ
                <br />
                ПРОТИВОСТОЯНИЕ
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Выберите свою сторону в битве между ангельскими и демоническими стартропами Brawl Stars
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
              <Card className="p-8 gradient-angel text-background hover:scale-105 transition-transform">
                <div className="text-center">
                  <div className="text-6xl mb-4">😇</div>
                  <h3 className="text-3xl font-black mb-4">АНГЕЛЬСКИЕ</h3>
                  <p className="text-background/80 mb-6">
                    Сила света и справедливости
                  </p>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full text-lg font-bold"
                    onClick={() => setActiveSection('vote')}
                  >
                    Голосовать
                  </Button>
                </div>
              </Card>

              <Card className="p-8 gradient-demon text-foreground hover:scale-105 transition-transform">
                <div className="text-center">
                  <div className="text-6xl mb-4">😈</div>
                  <h3 className="text-3xl font-black mb-4">ДЕМОНИЧЕСКИЕ</h3>
                  <p className="text-foreground/80 mb-6">
                    Мощь тьмы и хаоса
                  </p>
                  <Button
                    size="lg"
                    className="w-full text-lg font-bold bg-background text-foreground hover:bg-background/90"
                    onClick={() => setActiveSection('vote')}
                  >
                    Голосовать
                  </Button>
                </div>
              </Card>
            </div>

            <Card className="max-w-3xl mx-auto p-8 text-center">
              <h3 className="text-2xl font-bold mb-6">
                {isVotingEnded ? 'Голосование завершено!' : 'До окончания голосования:'}
              </h3>
              {!isVotingEnded && (
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Дней', value: timeLeft.days },
                    { label: 'Часов', value: timeLeft.hours },
                    { label: 'Минут', value: timeLeft.minutes },
                    { label: 'Секунд', value: timeLeft.seconds }
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <div className="text-4xl md:text-5xl font-black text-primary mb-2">
                        {value.toString().padStart(2, '0')}
                      </div>
                      <div className="text-sm text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {activeSection === 'vote' && (
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-center mb-8">
                ВЫБЕРИТЕ СТОРОНУ
              </h2>

              {isVotingEnded ? (
                <Card className="p-8 text-center">
                  <Icon name="Lock" size={64} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-2xl font-bold mb-2">Голосование завершено</h3>
                  <p className="text-muted-foreground">
                    Результаты доступны в разделе "Результаты"
                  </p>
                  <Button
                    size="lg"
                    className="mt-6"
                    onClick={() => setActiveSection('results')}
                  >
                    Посмотреть результаты
                  </Button>
                </Card>
              ) : hasVoted ? (
                <Card className="p-8 text-center">
                  <Icon name="CheckCircle2" size={64} className="mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold mb-2">Спасибо за участие!</h3>
                  <p className="text-muted-foreground">
                    Ваш голос учтён. Результаты будут доступны после завершения голосования.
                  </p>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  <Card
                    className="p-8 gradient-angel text-background cursor-pointer hover:scale-105 transition-transform animate-pulse-glow"
                    onClick={() => handleVote('angels')}
                  >
                    <div className="text-center">
                      <div className="text-8xl mb-6">😇</div>
                      <h3 className="text-4xl font-black mb-4">АНГЕЛЬСКИЕ</h3>
                      <p className="text-background/90 text-lg mb-6">
                        Нажмите, чтобы проголосовать за силы света
                      </p>
                      <Button
                        size="lg"
                        variant="secondary"
                        className="w-full text-xl font-bold py-6"
                      >
                        ГОЛОСОВАТЬ
                      </Button>
                    </div>
                  </Card>

                  <Card
                    className="p-8 gradient-demon text-foreground cursor-pointer hover:scale-105 transition-transform animate-pulse-glow"
                    onClick={() => handleVote('demons')}
                  >
                    <div className="text-center">
                      <div className="text-8xl mb-6">😈</div>
                      <h3 className="text-4xl font-black mb-4">ДЕМОНИЧЕСКИЕ</h3>
                      <p className="text-foreground/90 text-lg mb-6">
                        Нажмите, чтобы проголосовать за силы тьмы
                      </p>
                      <Button
                        size="lg"
                        className="w-full text-xl font-bold py-6 bg-background text-foreground hover:bg-background/90"
                      >
                        ГОЛОСОВАТЬ
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'results' && (
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-center mb-12">
                {isVotingEnded ? 'ИТОГИ ГОЛОСОВАНИЯ' : 'ТЕКУЩАЯ СТАТИСТИКА'}
              </h2>

              {!isVotingEnded && !hasVoted ? (
                <Card className="p-8 text-center">
                  <Icon name="Vote" size={64} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-2xl font-bold mb-2">Проголосуйте, чтобы увидеть результаты</h3>
                  <p className="text-muted-foreground mb-6">
                    Статистика будет доступна после вашего голосования
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setActiveSection('vote')}
                  >
                    Перейти к голосованию
                  </Button>
                </Card>
              ) : (
                <>
                  {isVotingEnded && (
                    <Card className="p-8 mb-8 text-center">
                      <h3 className="text-3xl font-black mb-4">
                        {winner === 'angels' && '😇 ПОБЕДИЛИ АНГЕЛЬСКИЕ СТАРТРОПЫ!'}
                        {winner === 'demons' && '😈 ПОБЕДИЛИ ДЕМОНИЧЕСКИЕ СТАРТРОПЫ!'}
                        {winner === 'tie' && '⚖️ НИЧЬЯ!'}
                      </h3>
                      <p className="text-xl text-muted-foreground">
                        Голосование завершено 8 января 2026 в 15:00
                      </p>
                    </Card>
                  )}

                  <div className="space-y-6">
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">😇</span>
                          <div>
                            <h4 className="text-xl font-bold">Ангельские стартропы</h4>
                            <p className="text-sm text-muted-foreground">{votes.angels} голосов</p>
                          </div>
                        </div>
                        <div className="text-4xl font-black text-primary">
                          {angelsPercent}%
                        </div>
                      </div>
                      <Progress value={angelsPercent} className="h-4 [&>div]:bg-gradient-to-r [&>div]:from-[hsl(var(--angel))] [&>div]:to-[hsl(var(--angel-light))]" />
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">😈</span>
                          <div>
                            <h4 className="text-xl font-bold">Демонические стартропы</h4>
                            <p className="text-sm text-muted-foreground">{votes.demons} голосов</p>
                          </div>
                        </div>
                        <div className="text-4xl font-black text-accent">
                          {demonsPercent}%
                        </div>
                      </div>
                      <Progress value={demonsPercent} className="h-4 [&>div]:bg-gradient-to-r [&>div]:from-[hsl(var(--demon))] [&>div]:to-[hsl(var(--demon-light))]" />
                    </Card>

                    <Card className="p-6">
                      <h4 className="text-xl font-bold mb-4">Общая статистика</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-3xl font-black text-primary mb-1">
                            {totalVotes}
                          </div>
                          <div className="text-sm text-muted-foreground">Всего голосов</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-3xl font-black text-accent mb-1">
                            {Math.abs(angelsPercent - demonsPercent)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Разница</div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h4 className="text-xl font-bold mb-4">Визуализация результатов</h4>
                      <div className="flex h-12 rounded-lg overflow-hidden">
                        <div
                          className="gradient-angel flex items-center justify-center font-bold text-background transition-all"
                          style={{ width: `${angelsPercent}%` }}
                        >
                          {angelsPercent > 15 && `${angelsPercent}%`}
                        </div>
                        <div
                          className="gradient-demon flex items-center justify-center font-bold text-foreground transition-all"
                          style={{ width: `${demonsPercent}%` }}
                        >
                          {demonsPercent > 15 && `${demonsPercent}%`}
                        </div>
                      </div>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeSection === 'video' && (
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-center mb-8">
                ВИДЕО
              </h2>
              <Card className="p-8">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6">
                  <Icon name="Youtube" size={64} className="text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  Открытие демонических стартропов
                </h3>
                <p className="text-muted-foreground mb-6">
                  Узнайте больше о причинах проведения этого эпического голосования и посмотрите, 
                  как мы открывали демонические стартропы!
                </p>
                <div className="space-y-3">
                  <Button size="lg" className="w-full" disabled>
                    <Icon name="ExternalLink" size={20} className="mr-2" />
                    Ссылка на видео будет добавлена позже
                  </Button>
                  <Button size="lg" variant="outline" className="w-full" disabled>
                    <Icon name="ExternalLink" size={20} className="mr-2" />
                    Посетить наш канал
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">
            Голосование завершится 8 января 2026 в 15:00
          </p>
          <p className="text-sm">
            Присоединяйтесь к нашему сообществу и помогите определить победителя! 🚀
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
