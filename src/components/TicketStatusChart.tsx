import { useEffect, useRef } from 'react';
import { Ticket } from '../types';

interface TicketStatusChartProps {
  tickets: Ticket[];
}

// Simple chart component - in a real app you would use a chart library
function TicketStatusChart({ tickets }: TicketStatusChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Set up chart
    const total = Math.max(open + inProgress + resolved, 1); // Avoid division by zero
    const centerX = canvasRef.current.width / 2;
    const centerY = canvasRef.current.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Draw segments
    let startAngle = 0;
    
    // Open tickets (blue)
    const openPercentage = open / total;
    const openEndAngle = startAngle + openPercentage * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, openEndAngle);
    ctx.fillStyle = '#3b82f6'; // primary-500
    ctx.fill();
    
    // In progress tickets (yellow)
    startAngle = openEndAngle;
    const inProgressPercentage = inProgress / total;
    const inProgressEndAngle = startAngle + inProgressPercentage * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, inProgressEndAngle);
    ctx.fillStyle = '#eab308'; // warning-500
    ctx.fill();
    
    // Resolved tickets (green)
    startAngle = inProgressEndAngle;
    const resolvedPercentage = resolved / total;
    const resolvedEndAngle = startAngle + resolvedPercentage * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, resolvedEndAngle);
    ctx.fillStyle = '#10b981'; // secondary-500
    ctx.fill();
    
    // Draw inner circle for donut effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    
    // Draw legend
    const legendItems = [
      { label: 'Open', color: '#3b82f6', count: open },
      { label: 'In Progress', color: '#eab308', count: inProgress },
      { label: 'Resolved', color: '#10b981', count: resolved }
    ];
    
    // Show totals in center
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${total}`, centerX, centerY - 10);
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('Total', centerX, centerY + 10);
    
  }, [tickets]);

  return (
    <div className="relative h-full">
      <canvas ref={canvasRef} width={300} height={200} className="mx-auto"></canvas>
      <div className="mt-4 flex justify-around text-xs text-gray-500">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-primary-500 rounded-full mr-1"></div>
          <span>Open ({tickets.filter(t => t.status === 'open').length})</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-warning-500 rounded-full mr-1"></div>
          <span>In Progress ({tickets.filter(t => t.status === 'in_progress').length})</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-secondary-500 rounded-full mr-1"></div>
          <span>Resolved ({tickets.filter(t => t.status === 'resolved').length})</span>
        </div>
      </div>
    </div>
  );
}

export default TicketStatusChart;