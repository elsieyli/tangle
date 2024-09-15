import React, { useState, useEffect, useRef } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import ForceGraph3D, { NodeObject } from 'react-force-graph-3d';
import * as THREE from 'three';
import {  GraphData, Node  } from "./data"
import { gsap } from "gsap";
import StarField from '../starfield';
import Modal from "./Modal" // Import the Modal component
import { useAction } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Id } from "../../convex/_generated/dataModel"
import { Card } from "../@/components/ui/card-stack"
// Define a type for the nodes in your graph data
interface GraphNode extends NodeObject {
  id: string
  embeddingId: Id<"peopleEmbedding">
  x?: number
  y?: number
  z?: number
}

interface CustomForceGraph3DProps {
  graphData: GraphData;
  highlightedNodeIds: string[]
}

const CustomForceGraph3D: React.FC<CustomForceGraph3DProps> = ({
  graphData,
  highlightedNodeIds = [],
}) => {
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
  const [clickedNode, setClickedNode] = useState<GraphNode | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false) // State for modal visibility
  const [suggestedPeople, setSuggestedPeople] = useState<Card[]>([]) // Store fetched data
  const getSuggested = useAction(api.people.similarPeopleByEmbeddingId)
  const graphRef = useRef<any>(null)
  //   const rotationRef = useRef(0)

  // Handle opening the modal
  const openModal = () => {
    setIsModalOpen(true)
  }

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false)
  }



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
    }
  }

  useEffect(() => {
    if (isModalOpen && clickedNode) {
      // Fetch the suggested people when the modal is opened
      getSuggested({ embeddingId: clickedNode.embeddingId }).then((data) => {
        // Transform or map data to fit the CardStack format
        const formattedData = data.map((person: any) => ({
          id: person._id,
          name: person.name,
          content: person.notes, // Adjust according to your data format
        }))
        console.log(formattedData)
        setSuggestedPeople(formattedData)
      })
    }
  }, [isModalOpen, clickedNode, getSuggested])

  useEffect(() => {
    const animateNodeMovement = (
      highlightedNodes: GraphNode[],
      xOffset: number,
      yOffset: number,
      zOffset: number
    ) => {
      highlightedNodes.forEach((node) => {
        const targetX = node.x ? node.x + xOffset : +xOffset
        const targetY = node.y ? node.y + yOffset : +yOffset
        const targetZ = node.z ? node.z + zOffset : +zOffset
        gsap.to(node, {
          fx: targetX, // Animate x position
          fy: targetY, // Animate x position
          fz: targetZ, // Animate x position
          duration: 2, // Duration of animation (1 second)
          ease: "elastic.out", // Easing function for smooth animation
        })
      })
    }

    if (graphRef.current) {
      const highlightedNodes = graphData.nodes.filter((node: Node) =>
        highlightedNodeIds.includes(node.id)
      )
      animateNodeMovement(highlightedNodes, 30, 0, 30) // Move x-axis and y-axis closer to the user by 30 units
    }
  }, [highlightedNodeIds, graphData.nodes])

  const [_, setTooltipPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (graphRef.current) {
      // Modify the link distance to set a default distance between nodes
      graphRef.current.d3Force("link")?.distance(150) // Setting a link distance of 100 units
    }
  }, [])

  useEffect(() => {
    if (hoveredNode) {
      const position = convert3DTo2D(hoveredNode);
      if (position) {
        console.log(position);
        setTooltipPosition({ x: position.x, y: position.y });
      }
    }
  }, [hoveredNode])

  //   // Rotate the graph
  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       if (graphRef.current) {
  //         rotationRef.current += 0.005 // Adjust the speed of rotation here

  //         // Rotate the camera in a circular orbit around the center of the graph
  //         const distanceFromCenter = 800 // Distance from the center of the graph
  //         const x = distanceFromCenter * Math.sin(rotationRef.current)
  //         const z = distanceFromCenter * Math.cos(rotationRef.current)

  //         graphRef.current.cameraPosition(
  //           { x, y: 200, z }, // Orbiting at a fixed height (y: 200)
  //           { x: 0, y: 0, z: 0 }, // Always look at the center of the graph
  //           3000 // Duration of the animation (in ms)
  //         )
  //       }
  //     }, 50) // Controls how smooth the rotation is (higher interval = less smooth)

  //     return () => clearInterval(interval) // Clean up on unmount
  //   }, [])

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
          nodeThreeObject={(n) => {
            const isHighlighted = highlightedNodeIds.includes(n.id)
            const geometry = new THREE.SphereGeometry(8, 16, 16);
            const material = new THREE.MeshBasicMaterial({ color: isHighlighted ? "orange" : 'purple' });
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
          onNodeClick={(node: GraphNode | null) => {
          setClickedNode(node)
        }}
      />
      </div>

      {/* Tooltip for Hovered Node */}
      {hoveredNode && (
        
          <div
            style={{
              position: "absolute",
              left: `20px`, // Move further away from the left
              top: `30px`, // Move further down
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "10px", // Slightly more padding for better appearance
              borderRadius: "3px",
              pointerEvents: "none", // Ensure the tooltip doesn't interfere with interaction
              maxWidth: "200px", // Limit the width to enable text wrapping
              whiteSpace: "normal", // Allow text wrapping
              wordWrap: "break-word", // Ensure long words are wrapped
              zIndex: 1
            }}
          >
            <h2 style={{ margin: 0, fontSize: "18px" }}>{hoveredNode.name}</h2>{" "}
            <button
              className="mt-3 mb-1 relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              style={{
                pointerEvents: "auto", // Make the button clickable
                cursor: "pointer", // Ensure it has the pointer cursor on hover
              }}
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                Meet Someone!
              </span>
            </button>
            <h3 style={{ margin: "10px 0 5px 0", fontSize: "14px" }}>Notes:</h3>{" "}
            {/* Heading before notes */}
            <p className="whitespace-pre-wrap" style={{ margin: 0 }}>
              {hoveredNode.notes.slice(0, 250)}
              {hoveredNode.notes.length > 250 && ".."}
            </p>
          </div>
        
      )}
      {clickedNode && !hoveredNode && (
        <div
          style={{
            position: "absolute",
            left: `20px`, // Move further away from the left
            top: `30px`, // Move further down
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "10px", // Slightly more padding for better appearance
            borderRadius: "3px",
            pointerEvents: "none", // Ensure the tooltip doesn't interfere with interaction
            maxWidth: "200px", // Limit the width to enable text wrapping
            whiteSpace: "normal", // Allow text wrapping
            wordWrap: "break-word", 
            zIndex:1 // Ensure long words are wrapped
          }}
        >
          <h2 style={{ margin: 0, fontSize: "18px" }}>{clickedNode.name}</h2>
          <button
            className="mt-3 mb-1 relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            style={{
              zIndex: 1,
               pointerEvents: "auto", // Make the button clickable
              cursor: "pointer", // Ensure it has the pointer cursor on hover
            }}
            onClick={openModal} // Open the modal on button click
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Meet Someone!
            </span>
          </button>
          <h3 style={{ margin: "10px 0 5px 0", fontSize: "14px" }}>Notes:</h3>
          <p className="whitespace-pre-wrap" style={{ margin: 0 }}>
            {clickedNode.notes.slice(0, 250)}
            {clickedNode.notes.length > 250 && ".."}
          </p>
        </div>
      )}

      {/* Modal for the clicked node */}
      <Modal suggestedPeople={suggestedPeople} isOpen={isModalOpen} onClose={closeModal} title="Meet Someone!">
        <p>Meeting details for {clickedNode?.name}</p>
      </Modal>
    </div>
  )
}

export default CustomForceGraph3D;
