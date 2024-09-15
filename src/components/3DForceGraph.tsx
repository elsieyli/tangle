import React, { useState, useEffect, useRef } from 'react';
import ForceGraph3D, { NodeObject } from 'react-force-graph-3d';
import * as THREE from 'three';
import { GraphData } from './data';
import StarField from '../starfield';

interface GraphNode extends NodeObject {
  id: string;
  name?: string;
  notes?: string;
  x?: number;
  y?: number;
  z?: number;
}

interface CustomForceGraph3DProps {
  graphData: GraphData;
}

const CustomForceGraph3D: React.FC<CustomForceGraph3DProps> = ({ graphData }) => {
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const graphRef = useRef<any>(null);

  const convert3DTo2D = (node: GraphNode) => {
    if (!node || !graphRef.current) return null;
    const camera = graphRef.current.camera();
    const vector = new THREE.Vector3(node.x, node.y, node.z);
    vector.project(camera);
    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;

    return {
      x: vector.x * widthHalf + widthHalf,
      y: -(vector.y * heightHalf) + heightHalf,
    };
  };

  const [_, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (hoveredNode) {
      const position = convert3DTo2D(hoveredNode);
      if (position) {
        console.log(position);
        setTooltipPosition({ x: position.x, y: position.y });
      }
    }
  }, [hoveredNode]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* StarField component as a background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2, // Make sure it's behind the graph
          pointerEvents: 'none', // Allow clicks to pass through
        }}
      >
        <StarField />
      </div>

      {/* ForceGraph3D */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1, // Ensure graph is on top
        }}
      >
        <ForceGraph3D
          height={700}
          ref={graphRef}
          graphData={graphData}
          nodeThreeObject={(node: GraphNode) => {
            const geometry = new THREE.SphereGeometry(8, 16, 16);
            const material = new THREE.MeshBasicMaterial({ color: 'purple' });
            const mesh = new THREE.Mesh(geometry, material);

            mesh.renderOrder = 5; // Ensure nodes render on top
            material.depthTest = false;
            material.depthWrite = false;

            return mesh;
          }}
          linkWidth={(link) => 1 + (link.value % 3)}
          linkColor={(link) => (link.value > 1 ? 'purple' : 'gray')}
          linkOpacity={0.4}
          onNodeDragEnd={(node: GraphNode) => {
            node.fx = node.x;
            node.fy = node.y;
            node.fz = node.z;
          }}
          onNodeHover={(node: GraphNode | null) => {
            setHoveredNode(node);
            document.body.style.cursor = node ? 'pointer' : 'default';
          }}
        />
      </div>

      {/* Tooltip for Hovered Node */}
      {hoveredNode && (
        <div
          style={{
            position: 'absolute',
            left: `20px`,
            top: `30px`,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '3px',
            pointerEvents: 'none', // Ensure tooltip doesn't block interaction
            maxWidth: '200px',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            zIndex: 2, // Ensure tooltip is above everything
          }}
        >
          <h2 style={{ margin: 0, fontSize: '18px' }}>{hoveredNode.name}</h2>
          <h3 style={{ margin: '10px 0 5px 0', fontSize: '14px' }}>Notes:</h3>
          <p style={{ margin: 0 }}>{hoveredNode.notes}</p>
        </div>
      )}
    </div>
  );
};

export default CustomForceGraph3D;
