import React from 'react';
import { TrendingUp, Target, MapPin, Plus, ArrowRight, PieChart, BarChart3, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

export const CommercialMirror: React.FC = () => {
  const { sales } = useStore();
  const navigate = useNavigate();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlySales = sales.filter(s => {
    const d = new Date(s.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && s.status === 'SALE';
  });

  const monthlyProposals = sales.filter(s => {
    const d = new Date(s.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && s.status === 'PROPOSAL';
  });

  const totalSalesValue = monthlySales.reduce((acc, curr) => acc + curr.value, 0);
  const salesGoal = 50000; // Exemplo de meta mensal em R$
  const goalProgress = Math.min((totalSalesValue / salesGoal) * 100, 100);

  const conversionRate = monthlyProposals.length > 0 
    ? ((monthlySales.length / (monthlySales.length + monthlyProposals.length)) * 100).toFixed(1) 
    : '0';

  const averageTicket = monthlySales.length > 0 
    ? (totalSalesValue / monthlySales.length).toFixed(2) 
    : '0';

  const pendingFollowUps = sales.filter(s => {
    if (s.status !== 'PROPOSAL') return false;
    const d = new Date(s.date);
    const diffDays = (new Date().getTime() - d.getTime()) / (1000 * 3600 * 24);
    return diffDays > 3;
  }).length;

  const uniqueAreas = Array.from(new Set(sales.map(s => s.area))).filter(Boolean);

  return (
    <div className="h-full flex flex-col space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">Gestão Comercial</h3>
        </div>
        <button
          onClick={() => navigate('/commercial')}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors group"
        >
          <Plus className="w-5 h-5 text-white/60 group-hover:text-white" />
        </button>
      </div>

      {/* 1. Meta de Faturamento (Progress Bar) */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-3">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Meta de Vendas</p>
            <p className="text-lg font-black text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalSalesValue)}
            </p>
          </div>
          <p className="text-[10px] font-bold text-blue-400">{goalProgress.toFixed(0)}%</p>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${goalProgress}%` }}
            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* 2. Taxa de Conversão */}
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <PieChart className="w-3 h-3 text-emerald-400" />
            <p className="text-[9px] text-white/40 uppercase font-black tracking-widest">Conversão</p>
          </div>
          <p className="text-xl font-black text-white">{conversionRate}%</p>
        </div>

        {/* 3. Ticket Médio */}
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-3 h-3 text-amber-400" />
            <p className="text-[9px] text-white/40 uppercase font-black tracking-widest">Ticket Médio</p>
          </div>
          <p className="text-xl font-black text-white">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Number(averageTicket))}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* 4. Funil de Vendas (Pipeline) */}
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-3 h-3 text-purple-400" />
            <p className="text-[9px] text-white/40 uppercase font-black tracking-widest">Pipeline</p>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-xl font-black text-white">{monthlyProposals.length}</p>
            <span className="text-[8px] text-white/30 uppercase">Abertos</span>
          </div>
        </div>

        {/* 5. Follow-ups Pendentes */}
        <div className={`p-3 rounded-xl border transition-all ${pendingFollowUps > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Clock className={`w-3 h-3 ${pendingFollowUps > 0 ? 'text-red-400' : 'text-white/40'}`} />
            <p className="text-[9px] text-white/40 uppercase font-black tracking-widest">Follow-ups</p>
          </div>
          <p className={`text-xl font-black ${pendingFollowUps > 0 ? 'text-red-400' : 'text-white'}`}>{pendingFollowUps}</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/commercial')}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-600/20 active:scale-95"
      >
        Central de Vendas
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
