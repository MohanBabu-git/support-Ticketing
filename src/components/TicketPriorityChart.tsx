import { useEffect, useRef } from 'react';
import { Ticket } from '../types';

interface TicketPriorityChartProps {
  tickets: Ticket[];
}

// Simple chart component - in a real app you would use a chart library
function TicketPriorityChart({ tickets }: TicketPriorityChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const low = tickets.filter(t => t.priority === 'low').length;
    const medium = tickets.filter(t => t.priority === 'medium').length;
    const high = tickets.filter(t => t.priority === 'high').length;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Set up horizontal bar chart
    const barHeight = 30;
    const barGap = 10;
    const maxBarWidth = canvasRef.current.width - 100;
    const startX = 80;
    const startY = 30;
    
    const total = Math.max(low + medium + high, 1); // Avoid division by zero
    
    // Draw bars
    // Low priority
    ctx.fillStyle = '#10b981'; // secondary-500
    const lowWidth = (low / total) * maxBarWidth;
    ctx.fillRect(startX, startY, lowWidth, barHeight);
    
    // Medium priority
    ctx.fillStyle = '#eab308'; // warning-500
    const mediumWidth = (medium / total) * maxBarWidth;
    ctx.fillRect(startX, startY + barHeight + barGap, mediumWidth, barHeight);
    
    // High priority
    ctx.fillStyle = '#ef4444'; // error-500
    const highWidth = (high / total) * maxBarWidth;
    ctx.fillRect(startX, startY + 2 * (barHeight + barGap), highWidth, barHeight);
    
    // Add labels
    ctx.fillStyle = '#1f2937';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    ctx.fillText('Low', startX - 10, startY + barHeight / 2);
    ctx.fillText('Medium', startX - 10, startY + barHeight + barGap + barHeight / 2);
    ctx.fillText('High', startX - 10, startY + 2 * (barHeight + barGap) + barHeight / 2);
    
    // Add values
    ctx.textAlign = 'left';
    ctx.fillText(`${low}`, startX + lowWidth + 5, startY + barHeight / 2);
    ctx.fillText(`${medium}`, startX + mediumWidth + 5, startY + barHeight + barGap + barHeight / 2);
    ctx.fillText(`${high}`, startX + highWidth + 5, startY + 2 * (barHeight + barGap) + barHeight / 2);
    
  }, [tickets]);

  return (
    <div className="relative h-full">
      <canvas ref={canvasRef} width={300} height={200} className="mx-auto"></canvas>
      <div className="mt-4 flex justify-around text-xs text-gray-500">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-secondary-500 rounded-full mr-1"></div>
          <span>Low ({tickets.filter(t => t.priority === 'low').length})</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-warning-500 rounded-full mr-1"></div>
          <span>Medium ({tickets.filter(t => t.priority === 'medium').length})</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-error-500 rounded-full mr-1"></div>
          <span>High ({tickets.filter(t => t.priority === 'high').length})</span>
        </div>
      </div>
    </div>
  );
}

export default TicketPriorityChart;