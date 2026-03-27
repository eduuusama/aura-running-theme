/**
 * Aura Running — Chart.js Initialization
 * Reads data-chart attribute (JSON) from canvas elements and renders charts
 */

(function() {
  'use strict';

  function initCharts() {
    const canvases = document.querySelectorAll('[data-chart]');
    if (!canvases.length || typeof Chart === 'undefined') return;

    // Aura brand colors
    const colors = [
      '#000000',     // Black
      '#666666',     // Muted
      '#d4c4a8',     // Accent tan
      '#3d3530',     // Brown
      '#999999',     // Light gray
      '#444444'      // Dark gray
    ];

    canvases.forEach(function(canvas) {
      try {
        const data = JSON.parse(canvas.dataset.chart);
        const type = canvas.dataset.chartType || 'bar';

        // Apply brand colors to datasets
        if (data.datasets) {
          data.datasets.forEach(function(ds, i) {
            if (!ds.backgroundColor) {
              ds.backgroundColor = colors[i % colors.length] + '80'; // 50% opacity
            }
            if (!ds.borderColor) {
              ds.borderColor = colors[i % colors.length];
            }
            if (type === 'line' && !ds.tension) {
              ds.tension = 0.3;
            }
          });
        }

        new Chart(canvas, {
          type: type,
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                labels: {
                  font: { family: 'Inter', size: 12, weight: 300 },
                  color: '#666'
                }
              }
            },
            scales: type !== 'pie' && type !== 'doughnut' ? {
              x: {
                ticks: { font: { family: 'Inter', size: 11, weight: 300 }, color: '#999' },
                grid: { color: 'rgba(0,0,0,0.05)' }
              },
              y: {
                ticks: { font: { family: 'Inter', size: 11, weight: 300 }, color: '#999' },
                grid: { color: 'rgba(0,0,0,0.05)' }
              }
            } : undefined
          }
        });
      } catch (e) {
        console.error('Chart init error:', e);
      }
    });
  }

  // Wait for Chart.js to load
  if (typeof Chart !== 'undefined') {
    initCharts();
  } else {
    window.addEventListener('load', initCharts);
  }
})();
