# Camel Up

a Website Version of Multi-player Board Game  
https://react-camel-up.firebaseapp.com/

## Introduction
- This web-game is based on a famous board game, Camel up. Like gambling horse, four players can bet on camels in turns. The winner is the richest player. In the home page, we can directly play the game through clicking "PLAY" button.  
  
![image](https://github.com/andy770921/React_Camel_Up/blob/master/readme_imgs/camelup_img.PNG)  
  
- We can check the game rule via by clicking "GUIDE" button or read advanced developing story by clicking "ABOUT" button.  
  
![image](https://github.com/andy770921/React_Camel_Up/blob/master/readme_imgs/camelup_img2.PNG)  
  
- When we click "PLAY" button, the loading page will be shown for a while. After that, click "GAME START" button to start the game. Before players' acting, each camel jumps randomly and automatically once, determined their starting position.  
  
![image](https://github.com/andy770921/React_Camel_Up/blob/master/readme_imgs/camelup_img3.PNG)  
  
- After every camel finished jumping, 1st player can take actions. There are three actions can be taken: rolling dice, betting round winner, and betting final rank, corresponding to three yellow buttons below player's name. Each time the player can choose either one of that.  
  
![image](https://github.com/andy770921/React_Camel_Up/blob/master/readme_imgs/camelup_img4.PNG)  
  
- Once 1st player finished his/her action, the 2nd player's turn begins. The turn switches between players iteratively until the first camel crosses the finish line. The richest player is the winner.  
  
![image](https://github.com/andy770921/React_Camel_Up/blob/master/readme_imgs/camelup_img5.PNG)  
  
![image](https://github.com/andy770921/React_Camel_Up/blob/master/readme_imgs/camelup_img6.PNG)  
  

## Development Environment Setup
- The React library was chosen for building encapsulated components.
- The React-Hook was imported for more flexibility of functional programming.
- The React-Context was adopted for dealing with global state in more elegant way without passing props hierarchically, such as information of players' betting cards or players' money.
- The reducer technique was also utilized in the situation of complicated and diversified data manipulation.
- To extend more pages, React-Router was employed.
- To handle the 3D world and related physical effect, three.js and cannon.js libraries were imported.
- The card rotation effect was achieved via tween.js library.
- The Webpack bundled all above packages and delivered a SPA (single page application) for deploying.

## 3D Scene Construct
- Some of 3D models were generated directly through three.js like board squares. After covering them with textural images appropriately, they became real. The other 3D models were more complex like camel chesses and the desert background. Such models were edited through the Blender, a 3D creation application, and then export web-compatible models. 
- Building 3D models didn't mean they are alive. The physical effects, like collision and falling down, needed to be defined. The practice of camel jumping effect simulated successfully by mathematizing the concept of Newton's Second Law. The practice of dice rolling effect was achieved by the functions of cannon.js library.

## Game Logic Design
- Based on the game rule, the possible game flow took turns between players' command and 3D chess motion or players' info change. Player clicked UI bottom and then becoming things happened, such as camel jumping or UI refresh. Therefore, the components separation and data transfer is important.
- In this project, the UI components was separated into 3D scene, bottoms, pop-up windows, and info area. Via clicking bottoms and pop-up windows, players sent their command to change the state and then the view of 3D scene or info area changed.

## Artistic Style Design
- Camels appear in the dessert so the brown-series color was main theme. 
- The UI elements such as gold frame, yellow buttons, gambling cards background and vintage parchment were all follow this idea.
- Since the world was 3D, the players' image design kept the same style.
