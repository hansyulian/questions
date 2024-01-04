import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Box, OrbitControls, } from "@react-three/drei"
import { Vector3, Box3 } from 'three';


function Demo() {
  const cameraRef = useRef();
  const boxRef = useRef();
  const boundaryBoxRef = useRef();

  useThree(({ camera }) => {
    cameraRef.current = camera;
  })

  useEffect(() => {
    window.cameraRef = cameraRef;
    window.debugCameraPosition = () => {
      console.log(cameraRef.current.position.toArray())
    }
  }, [cameraRef])

  useEffect(() => {
    boundaryBoxRef.current = new Box3().setFromObject(boxRef.current);
  }, [boxRef])

  useFrame(() => {
    const camera = cameraRef.current;
    const boundaryBox = boundaryBoxRef.current;
    if (!camera || !boundaryBox) {
      return;
    }
    const outside = !isPointInsideBoundingBox(camera.position, boundaryBox);
    if (outside) {
      camera.position.set(...calculateClosestPointToBoundingBox(camera.position, boundaryBox));
    }
  })
  return <>
    <OrbitControls />
    <Box ref={boxRef} args={[20, 20, 20]}>
      <meshBasicMaterial attach='material' color='yellow' transparent opacity={0.1} />
    </Box>
    {/* center */}
    <Box args={[1, 1, 1]}>
      <meshBasicMaterial attach='material' color='blue' />
    </Box>
    {/* vertex references */}
    <Box args={[1, 1, 1]} position={[10, 10, 10]}>
      <meshBasicMaterial attach='material' color='red' />
    </Box>
    <Box args={[1, 1, 1]} position={[10, 10, -10]}>
      <meshBasicMaterial attach='material' color='red' />
    </Box>
    <Box args={[1, 1, 1]} position={[10, -10, 10]}>
      <meshBasicMaterial attach='material' color='red' />
    </Box>
    <Box args={[1, 1, 1]} position={[10, -10, -10]}>
      <meshBasicMaterial attach='material' color='red' />
    </Box>
    <Box args={[1, 1, 1]} position={[-10, 10, 10]}>
      <meshBasicMaterial attach='material' color='red' />
    </Box>
    <Box args={[1, 1, 1]} position={[-10, 10, -10]}>
      <meshBasicMaterial attach='material' color='red' />
    </Box>
    <Box args={[1, 1, 1]} position={[-10, 10, -10]}>
      <meshBasicMaterial attach='material' color='red' />
    </Box>
    <Box args={[1, 1, 1]} position={[-10, -10, 10]}>
      <meshBasicMaterial attach='material' color='red' />
    </Box>
    <Box args={[1, 1, 1]} position={[-10, -10, -10]}>
      <meshBasicMaterial attach='material' color='red' />
    </Box>
  </>
}

function App() {
  return (
    <Canvas>
      <Demo />
    </Canvas>
  );
}

function calculateClosestPointToBoundingBox(point, box, outside = false) {

  // Get the minimum and maximum coordinates of the bounding box
  const { min, max } = box;

  // Calculate the closest point on each axis
  const closestPoint = new Vector3();
  if (outside) {
    closestPoint.x = point.x < min.x ? min.x : (point.x > max.x ? max.x : point.x);
    closestPoint.y = point.y < min.y ? min.y : (point.y > max.y ? max.y : point.y);
    closestPoint.z = point.z < min.z ? min.z : (point.z > max.z ? max.z : point.z);

  } else {
    closestPoint.x = Math.min(Math.max(point.x, min.x), max.x);
    closestPoint.y = Math.min(Math.max(point.y, min.y), max.y);
    closestPoint.z = Math.min(Math.max(point.z, min.z), max.z);

  }

  return closestPoint;
}

export function isPointInsideBoundingBox(point, box) {
  return (
    point.x >= box.min.x && point.x <= box.max.x &&
    point.y >= box.min.y && point.y <= box.max.y &&
    point.z >= box.min.z && point.z <= box.max.z
  );
}

export default App;
