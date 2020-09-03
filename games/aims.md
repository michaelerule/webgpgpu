

Let's build a javascript city builder that uses webGL for all the logic

"breathe": An 8-bit browser game for a sustainable world

- 1980s pixel artwork. Simple design. Fast code. 
- Separate game specification (json) from engine implementation. 
- Templating language to build kernels? 
- Coarse grid: game state; Very small. 32x32. Short games <20mins. 
- Rendered grid: pixel values
- Combines a cellular automata simulation with infrastructure
- No agents, only density flows
- Purely static (save game in cookie)

All game state packed into textures consisting of
- float8 : 8-bit fixed point 
- bit    : 1 bit of an 8-bit word

Rendering kernel
- New state computed entirely from previous state
- State variables need to be grouped into independent sets

Interface design
- Alpha-centauri-like interface, to work on mobile

Minimal starting game for testing
- Terrain undergoes 3 ecological secession stages
- Roads create a connected component along which state can diffuse
- State includes resources
- Roads deplete resources at some rate




Terrain
- Water
- Land

Resources: 
- Nutrients: float
- Rainfall:  float
- Aquifer: float
- Mineral: float

Biomes: 
- Collapsed
- Marginal
- Recovering
- Young forest
- Old Forest

Cropland
- Planted
- Growing
- Harvested
- Blighted

Atmosphere contains
- Carbon
- Mineral (unrecovered heavy metals)
- Temperature
- Moisture

Global variables
- Population
- Wealth
- Production goods
  - Food

Buildings
- Well
- Pump
- Food store
- Food outlet
- Battery
- Solar
- Wind
- Fossil Burner

City variables
- Power
- Hydro
- Transit







