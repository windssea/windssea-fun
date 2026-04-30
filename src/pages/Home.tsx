import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  const icons = [
    { id: 'morse', label: 'MORSE', active: true, path: '/morse', icon: '📟' },
    ...Array(11).fill({ active: false })
  ];

  return (
    <div className="min-h-screen p-5 flex flex-col items-center">
      <header className="mt-8 mb-12">
        <h1 className="text-terminal-green opacity-40 text-xs tracking-[3px] font-bold">
          WINDSSEA.FUN
        </h1>
      </header>
      
      <div className="grid grid-cols-4 gap-[14px] w-full max-w-sm">
        {icons.map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <div 
              onClick={() => item.active && navigate(item.path)}
              className={`w-12 h-12 rounded-icon flex items-center justify-center text-xl transition-all
                ${item.active 
                  ? 'bg-terminal-dim border-[1.5px] border-terminal-green glow cursor-pointer active:scale-95' 
                  : 'bg-terminal-dark border border-dashed border-terminal-gray'}`}
            >
              {item.active ? item.icon : ''}
            </div>
            <span className={`text-[8px] mt-1 ${item.active ? 'text-terminal-text' : 'text-terminal-inactive'}`}>
              {item.active ? item.label : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
