"use client";

import React, { useMemo, useEffect, useRef, useCallback } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { div } from 'framer-motion/client';

const COLORS = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0891b2", "#f59e0b"];


interface GraphViewProps {
  data: any;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}


export default function GraphView({ data, selectedId, onSelect }: GraphViewProps) {
  const cyRef = useRef<any>(null);

  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;
    
    cy.batch(() => {
      cy.$(':selected').unselect(); // Bỏ chọn cũ
      if (selectedId) {
        const target = cy.$id(selectedId);
        if (target.length) {
          target.select();
        }
      }
    });
  }, [selectedId]);

  const setCy = useCallback((cy: any) => {
    cyRef.current = cy;

    cy.on('tap', 'node', (evt: any) => {
      onSelect(evt.target.id());
    });
    cy.on('tap', (evt: any) => {
      if (evt.target === cy) onSelect(null); // Click vào vùng trống thì bỏ chọn
    });
    cy.on('layoutstop', () => cy.fit());

    cy.userZoomingEnabled(true);
    cy.boxSelectionEnabled(true);
    cy.userPanningEnabled(true);

    return () => {
      if (cy) {
        cy.destroy();
      }
    };
  }, [onSelect]);

  // 1. Chuyển đổi dữ liệu sang định dạng Cytoscape
  const elements = useMemo(() => {
    const nodes = data.nodes.map((node: any, index: number) => ({
      data: { 
        id: node.id, 
        label: node.title.split(" ").slice(0, 3).join(" ") + "...", 
        rank: node.rank,
        color: COLORS[index % COLORS.length]
      }
    }));

    const edges = data.links.map((link: any) => ({
      data: { source: link.source, target: link.target }
    }));

    return [...nodes, ...edges];
  }, [data]);

  // 2. Định nghĩa Style (Giống như CSS cho đồ thị)
  const stylesheet: any = useMemo(() => [
    {
      selector: 'node',
      style: {
        'width': 'mapData(rank, 0, 0.5, 20, 80)', // Rank càng cao node càng to
        'height': 'mapData(rank, 0, 0.5, 20, 80)',
        'background-color': 'data(color)',
        'label': 'data(label)',
        'font-size': '10px',
        'color': '#475569',
        'text-valign': 'bottom',
        'text-margin-y': '6px',
        'text-wrap': 'wrap',
        'text-max-width': '80px',
        'overlay-padding': '6px',
        'z-index': 10
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#94A3B8',
        'target-arrow-color': '#CBD5E1',
        'target-arrow-shape': 'triangle', // Hiện mũi tên hướng trích dẫn
        'curve-style': 'bezier', // Đường cong để tránh đè lên nhau
        'opacity': 0.9,
        'arrow-scale': 1.3
      }
    },
    {
      selector: 'node:selected',
      style: {
        'border-width': '6px',
        'border-color': '#3b82f6',
        'border-opacity': 0.8
      }
    }
  ], []);

  // 3. Cấu hình Layout (Thuật toán sắp xếp vị trí)
  const layout = {
    name: 'cose', // Complex Systems Engineering layout (rất hợp với mạng lưới)
    idealEdgeLength: 100,
    nodeOverlap: 20,
    refresh: 20,
    fit: true,
    padding: 30,
    randomize: false,
    componentSpacing: 100,
    nodeRepulsion: 400000,
    edgeElasticity: 100,
    nestingFactor: 5,
    gravity: 80,
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0
  };

  return (
    <div className="w-full h-full bg-[#FAFAFA] border-none">
      <CytoscapeComponent
        key={data?.nodes?.length || 0}
        elements={elements}
        style={{ width: '100%', height: '100%' }}
        stylesheet={stylesheet}
        layout={layout}
        cy={setCy}
      />
    </div>
  );
}