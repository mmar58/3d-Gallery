import * as THREE from "./vendor/three.module.js"
import {
  GLTFLoader
} from "./vendor/examples/loaders/GLTFLoader.js"
import {
  Reflector
} from "./vendor/examples/objects/Reflector.js"

var imageAssetDirectory="./Assets/images/"
var imageAssetList = ["Facebook_logo_(square).png","Github.jpg","linkdin.webp","Facebook_logo_(square).png","Github.jpg","linkdin.webp"]
var links = ["https://www.facebook.com/mmar580","https://www.github.com/mmar58","https://www.linkedin.com/in/mmar58","https://www.facebook.com/mmar580","https://www.github.com/mmar58","https://www.linkedin.com/in/mmar58"]

var onMobileDevice = false;
if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  onMobileDevice = true
}

const ThreeJSContainer = document.getElementById('ThreeJSContainerDiv');
var items = []
var walllist = []
var scene = new THREE.Scene();
var wallModel = null;
var perPicDistance = 15;
var movementSpeed = 0,
  reduceSpeed = .016,
  sideMovementSpeed = 0;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var intersects;
var moveToLeft = false;
var rotationLimit = .3
var SpeedCap = 3.8;
var cameraRotateOff = true
// create the camera
// var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
const camera = new THREE.PerspectiveCamera(75, ThreeJSContainer.clientWidth/ ThreeJSContainer.clientHeight, 0.1, 1000);
camera.position.x = 8
camera.position.y = -1
//Selected items variables
var selectedItem,
    selectedItemLastPosition=new THREE.Vector3,selectedItemTargetPosition=new THREE.Vector3(camera.position.x,-.3,1),selectedItemLastRotationY,
    selectedItemMovementSpeed=.3,selectedItemMovementVector=new THREE.Vector3(),selectedItemTempMovementSpeed=selectedItemMovementSpeed
// create the renderer
var renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(window.devicePixelRatio);
// document.body.appendChild(renderer.domElement);
renderer.setSize(ThreeJSContainer.clientWidth, ThreeJSContainer.clientHeight);
ThreeJSContainer.appendChild(renderer.domElement)
//Loading textures
for (var i = 0; i < imageAssetList.length; i++) {
  var cubeGeometry = new THREE.BoxGeometry((6 * 3 / 4) * 7 / 8, (5 * 3 / 4) * 7 / 8, .2);
  // 

  var texture = new THREE.TextureLoader().load(imageAssetDirectory + imageAssetList[i]);
  if (i == 0) {

  }
  var cubeMaterial = [
    new THREE.MeshBasicMaterial({
      color: 0x000
    }), // red
    new THREE.MeshBasicMaterial({
      color: 0x000
    }), // green
    new THREE.MeshBasicMaterial({
      color: 0x000
    }), // blue
    new THREE.MeshBasicMaterial({
      color: 0x000
    }), // yellow
    new THREE.MeshBasicMaterial({
      map: texture
    }), // image texture
    new THREE.MeshBasicMaterial({
      color: 0x000
    }) // magenta
  ];
  // create the cube mesh
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  scene.add(cube);
  //console.log(i + " " + i % 2)
  if (i % 2 == 0) {
    cube.position.x = 14
    cube.rotation.y = -.4
  } else {
    cube.position.x = 2.5
    cube.rotation.y = .4
  }
  cube.position.y = -1.7
  // 
  cube.position.z = -perPicDistance / 2 - perPicDistance * i
  cube.name = i
  cube.link = links[i]
  items.push(cube)
}
//Creating reflexing ground
const reflectorGeometry = new THREE.PlaneGeometry(45, 120);
var reflector
if(onMobileDevice){
  reflector = new Reflector(reflectorGeometry, {
    textureWidth: 400 * window.devicePixelRatio,
    textureHeight: 400 * window.devicePixelRatio,
    color: 0x889999,
  });
}
else{
  reflector = new Reflector(reflectorGeometry, {
    textureWidth: 1024 * window.devicePixelRatio,
    textureHeight: 1024 * window.devicePixelRatio,
    color: 0x889999,
  });
}

reflector.rotation.x = Math.PI * -0.5;
reflector.position.y = -3.4;

reflector.position.x = 7
reflector.material.alphaTest = 1
reflector.material.opacity = 1
scene.add(reflector);

// move the camera back so we can see the cube
camera.position.z = 5;

// create the light
var light = new THREE.AmbientLight(0xffffff);
light.position.set(5, 5, 5);

// add the light to the scene
scene.add(light);


// render the scene
function render() {
  requestAnimationFrame(render);
  // cubeCamera.update( renderer, scene );
  renderer.render(scene, camera);
}
render();
var lastTimeUpdate = 0;
var lastx = 0;

function update() {

  if (selectedItem != null) {
    var curDistance=selectedItemTargetPosition.distanceTo(selectedItem.position)
    if(curDistance>selectedItemTempMovementSpeed){
      selectedItem.rotation.y =0
      selectedItem.position.add(selectedItemMovementVector)
      if(selectedItemTempMovementSpeed<selectedItemMovementSpeed*2){
        selectedItemMovementVector.multiplyScalar(1.1)
        selectedItemTempMovementSpeed=selectedItemTempMovementSpeed*1.1
      }
    }
    else{
      window.open(selectedItem.link, '_blank')
      selectedItem.position.copy(selectedItemLastPosition)
      selectedItem.rotation.y =selectedItemLastRotationY
      selectedItem=null
    }
  }
  else{
    for (var i = 0; i < items.length; i++) {
      var element = items[i]
        if (i == 0) {
          if (movementSpeed != 0) {
            element.position.z += movementSpeed
            if (movementSpeed > 0) {
              movementSpeed = movementSpeed - reduceSpeed
              if (movementSpeed > 5) {
                movementSpeed -= movementSpeed / 15
              }
            } else {
              movementSpeed = movementSpeed + reduceSpeed
              if (movementSpeed < -5) {
                movementSpeed += movementSpeed / 15
              }
            }
          }
        } else {
          element.position.z = items[0].position.z - i * perPicDistance
        }
        if (element.position.z > 4.8) {
          // //console.log(element.position.z)
          element.position.z = -(perPicDistance * imageAssetList.length) + element.position.z
          // //console.log("Front"+i+" "+element.position.z)
        } else if (element.position.z < -(perPicDistance * imageAssetList.length - 4.8)) {
          element.position.z = 4.8 + (perPicDistance * imageAssetList.length + element.position.z - 4.8)
          // //console.log("Back"+i+" "+element.position.z)
        }
        if (element.position.z < -perPicDistance * 7) {
          element.visible = false;
          if (element.box != null) {
            element.box.visible = false
          }
        } else {
          element.visible = true;
          if (element.box != null) {
            element.box.visible = true
          }
        }
        if (items[i].box != null) {
          items[i].box.position.x = items[i].position.x
          items[i].box.position.z = items[i].position.z
        }
      
    }
  }
  if (wallModel != null) {
    for (var i = 0; i < walllist.length; i++) {
      walllist[i].position.z += movementSpeed
      if (walllist[i].position.z > 50.3) {
        walllist[i].position.z = -246 + (walllist[i].position.z - 49.2)
      } else if (walllist[i].position.z < -246) {
        walllist[i].position.z = 49.2 + (walllist[i].position.z + 246)
      }
    }
  }
  
  let tempMovementSpeed = Math.round(movementSpeed * 100)
  movementSpeed = tempMovementSpeed / 100
  setTimeout(update, 1000/60)

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);
// createBase()
update()
window.addEventListener("wheel", function (e) {
  //console.log(e.deltaY)
  if (e.deltaY > 0) {
    if (movementSpeed < SpeedCap) {
      movementSpeed = movementSpeed + .08
    }

  } else {
    if (movementSpeed > -SpeedCap / 2) {
      movementSpeed = movementSpeed - .08
    }

  }
  // code to increment object.position.z 
}, true);
//Adding mouse controls
function onMouseMove(event) {
  // Calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  
  // 1. Get bounding rect of the canvas
  const rect = renderer.domElement.getBoundingClientRect();
  
  // 2. Adjust mouse/pointer position to account for the offset 
  // of the canvas within the container
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function onMouseClick(event) {
  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // // calculate objects intersecting the picking ray
  intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    if (intersects[0].object.link != null) {
      selectedItem = intersects[0].object
      selectedItemLastPosition=selectedItem.position.clone()
      selectedItemLastRotationY=selectedItem.rotation.y
      selectedItemMovementVector=selectedItemTargetPosition.clone()
      selectedItemMovementVector.sub(selectedItemLastPosition)
      var tempSpeed=selectedItemMovementSpeed/(Math.abs(selectedItemMovementVector.x)+Math.abs(selectedItemMovementVector.y)+Math.abs(selectedItemMovementVector.z))
      selectedItemMovementVector.multiplyScalar(tempSpeed)

      selectedItemTempMovementSpeed=selectedItemMovementSpeed
      // window.location.href = intersects[0].object.link
    }
    console.log(intersects[0].object)
    console.log(intersects.length)
  }
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onMouseClick, false);
var lastTouchYPosition = 0
window.addEventListener("touchstart", function (e) {
  //console.log("Touch started")
  lastTouchYPosition = e.targetTouches[0].screenY
})
window.addEventListener("touchmove", function (e) {
  //console.log("Touch moved")
  if (e.targetTouches[0].screenY > lastTouchYPosition) {
    if (movementSpeed < SpeedCap) {
      movementSpeed = movementSpeed + .08 * 1
    }

  } else if (e.targetTouches[0].screenY < lastTouchYPosition) {
    if (movementSpeed > -SpeedCap / 2) {
      movementSpeed = movementSpeed - .08 * 1
    }
  }
  lastTouchYPosition = e.targetTouches[0].screenY
})