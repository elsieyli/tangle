import ForceGraph3D, { NodeObject } from "react-force-graph-3d"
import { gData } from "./data"
import * as THREE from "three"
import { useEffect, useRef, useState } from "react"

// Define a type for the nodes in your graph data
interface GraphNode extends NodeObject {
  id: string
  x?: number
  y?: number
  z?: number
}

const CustomForceGraph3D = () => {
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphRef = useRef<any>(null)
//   const rotationRef = useRef(0)

  // Function to convert 3D coordinates to 2D screen coordinates
  const convert3DTo2D = (node: GraphNode) => {
    if (!node || !graphRef.current) return null
    const camera = graphRef.current.camera()
    const vector = new THREE.Vector3(node.x, node.y, node.z)
    vector.project(camera)
    const widthHalf = window.innerWidth / 2
    const heightHalf = window.innerHeight / 2

    return {
      x: vector.x * widthHalf + widthHalf,
      y: -(vector.y * heightHalf) + heightHalf,
    }
  }

  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (hoveredNode) {
      const position = convert3DTo2D(hoveredNode)
      if (position) {
        console.log(position)
        setTooltipPosition({ x: position.x, y: position.y })
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
    <>
      <ForceGraph3D
        height={700}
        ref={graphRef}
        graphData={gData}
        //   can pass node as parameter below
        nodeThreeObject={() => {
          const geometry = new THREE.SphereGeometry(8, 16, 16)
          const material = new THREE.MeshBasicMaterial({
            color: "purple",
          })
          return new THREE.Mesh(geometry, material)
        }}
        linkWidth={(link) => 1 + (link.value % 3)}
        // Link values start at 1, and after they meet they go up
        linkColor={(link) => (link.value > 1 ? "purple" : "gray")}
        linkOpacity={0.4}
        onNodeDragEnd={(node: GraphNode) => {
          node.fx = node.x
          node.fy = node.y
          node.fz = node.z
        }}
        onNodeHover={(node: GraphNode | null) => {
          setHoveredNode(node)
          document.body.style.cursor = node ? "pointer" : "default"
        }}
      />
      {/* Tooltip for Hovered Node */}
      {hoveredNode && (<>
        <div
          style={{
            position: "absolute",
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "5px",
            borderRadius: "3px",
            pointerEvents: "none", // Make sure the tooltip doesn't interfere with interaction
          }}
        >
          {hoveredNode.id}
        </div>
        <div
          style={{
            position: "absolute",
            left: `10px`,
            top: `10px`,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "5px",
            borderRadius: "3px",
            pointerEvents: "none", // Make sure the tooltip doesn't interfere with interaction
          }}
        >
          {hoveredNode.id }
        </div>
        
        
         </>
      )}
    </>
  )
}

export default CustomForceGraph3D
