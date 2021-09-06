
<a name="readmemd"></a>

Template for making easy-to-work-with tempates

# flowpoints


<a name="_librarymd"></a>

@raydeck/flowpoints - v1.1.1

# @raydeck/flowpoints - v1.1.1

## Table of contents

### Modules

- [Flowpoint](#modulesflowpointmd)
- [Flowspace](#modulesflowspacemd)
- [Helpers](#moduleshelpersmd)
- [index](#modulesindexmd)


<a name="interfaceshelperspointmd"></a>

[@raydeck/flowpoints - v1.1.1](#readmemd) / [Helpers](#moduleshelpersmd) / Point

# Interface: Point

[Helpers](#moduleshelpersmd).Point

## Hierarchy

- **`Point`**

  ↳ [`Position`](#interfaceshelperspositionmd)

## Table of contents

### Properties

- [offsetX](#offsetx)
- [offsetY](#offsety)
- [x](#x)
- [y](#y)

## Properties

### offsetX

• **offsetX**: `number`

#### Defined in

[Helpers.tsx:6](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L6)

___

### offsetY

• **offsetY**: `number`

#### Defined in

[Helpers.tsx:7](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L7)

___

### x

• **x**: `number`

#### Defined in

[Helpers.tsx:4](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L4)

___

### y

• **y**: `number`

#### Defined in

[Helpers.tsx:5](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L5)


<a name="interfaceshelperspositionmd"></a>

[@raydeck/flowpoints - v1.1.1](#readmemd) / [Helpers](#moduleshelpersmd) / Position

# Interface: Position

[Helpers](#moduleshelpersmd).Position

## Hierarchy

- [`Point`](#interfaceshelperspointmd)

  ↳ **`Position`**

## Table of contents

### Properties

- [height](#height)
- [offsetX](#offsetx)
- [offsetY](#offsety)
- [width](#width)
- [x](#x)
- [y](#y)

## Properties

### height

• **height**: `number`

#### Defined in

[Helpers.tsx:10](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L10)

___

### offsetX

• **offsetX**: `number`

#### Inherited from

[Point](#interfaceshelperspointmd).[offsetX](#offsetx)

#### Defined in

[Helpers.tsx:6](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L6)

___

### offsetY

• **offsetY**: `number`

#### Inherited from

[Point](#interfaceshelperspointmd).[offsetY](#offsety)

#### Defined in

[Helpers.tsx:7](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L7)

___

### width

• **width**: `number`

#### Defined in

[Helpers.tsx:11](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L11)

___

### x

• **x**: `number`

#### Inherited from

[Point](#interfaceshelperspointmd).[x](#x)

#### Defined in

[Helpers.tsx:4](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L4)

___

### y

• **y**: `number`

#### Inherited from

[Point](#interfaceshelperspointmd).[y](#y)

#### Defined in

[Helpers.tsx:5](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L5)


<a name="modulesflowpointmd"></a>

[@raydeck/flowpoints - v1.1.1](#readmemd) / Flowpoint

# Module: Flowpoint

## Table of contents

### Variables

- [default](#default)

## Variables

### default

• `Const` **default**: `FC`<`FlowpointProps`\>

#### Defined in

[Flowpoint.tsx:63](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Flowpoint.tsx#L63)


<a name="modulesflowspacemd"></a>

[@raydeck/flowpoints - v1.1.1](#readmemd) / Flowspace

# Module: Flowspace

## Table of contents

### Variables

- [default](#default)

### Functions

- [useFlowspace](#useflowspace)

## Variables

### default

• `Const` **default**: `FC`<`Object`\>

#### Defined in

[Flowspace.tsx:90](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Flowspace.tsx#L90)

## Functions

### useFlowspace

▸ **useFlowspace**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `deleteFlowpoint` | `DeleteFlowpoint` |
| `scale` | `number` |
| `selected` | `string`[] |
| `spaceColor` | [`ColorSet`](#colorset) |
| `theme` | [`ValidColor`](#validcolor) |
| `updateFlowpoint` | `UpdateFlowpoint` |
| `variant` | [`Variant`](#variant) |

#### Defined in

[Flowspace.tsx:61](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Flowspace.tsx#L61)


<a name="moduleshelpersmd"></a>

[@raydeck/flowpoints - v1.1.1](#readmemd) / Helpers

# Module: Helpers

## Table of contents

### Interfaces

- [Point](#interfaceshelperspointmd)
- [Position](#interfaceshelperspositionmd)

### Type aliases

- [ColorSet](#colorset)
- [FlowpointInfo](#flowpointinfo)
- [Location](#location)
- [Output](#output)
- [ValidColor](#validcolor)
- [Variant](#variant)

### Variables

- [colors](#colors)

### Functions

- [AutoGetLoc](#autogetloc)
- [CalcPos](#calcpos)
- [getColor](#getcolor)

## Type aliases

### ColorSet

Ƭ **ColorSet**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `a` | `string` |
| `o` | `string` |
| `p` | `string` |
| `s` | `string` |
| `t` | ``"light"`` \| ``"dark"`` |

#### Defined in

[Helpers.tsx:171](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L171)

___

### FlowpointInfo

Ƭ **FlowpointInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `event?` | `string` |
| `outputs` | `Record`<`string`, [`Output`](#output)\> |
| `position` | [`Position`](#interfaceshelperspositionmd) |

#### Defined in

[Helpers.tsx:26](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L26)

___

### Location

Ƭ **Location**: ``"top"`` \| ``"bottom"`` \| ``"left"`` \| ``"right"`` \| ``"auto"``

#### Defined in

[Helpers.tsx:13](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L13)

___

### Output

Ƭ **Output**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `arrowEnd?` | `boolean` |
| `arrowStart?` | `boolean` |
| `dash?` | `number` |
| `input?` | [`Location`](#location) |
| `inputColor?` | `string` |
| `output?` | [`Location`](#location) |
| `outputColor?` | `string` |
| `width?` | `number` |
| `onClick?` | (`pointKey`: `string`, `outKey`: `string`, `e`: `MouseEvent`<`Element`, `MouseEvent`\>) => `void` |

#### Defined in

[Helpers.tsx:14](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L14)

___

### ValidColor

Ƭ **ValidColor**: keyof typeof [`colors`](#colors)

#### Defined in

[Helpers.tsx:178](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L178)

___

### Variant

Ƭ **Variant**: ``"paper"`` \| ``"outlined"`` \| ``"filled"``

#### Defined in

[Helpers.tsx:31](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L31)

## Variables

### colors

• `Const` **colors**: `Object`

#### Index signature

▪ [key: `string`]: [`ColorSet`](#colorset)

#### Defined in

[Helpers.tsx:36](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L36)

## Functions

### AutoGetLoc

▸ **AutoGetLoc**(`pa`, `pb`, `aLoc`, `bLoc`, `key1`, `key2`, `allPositions`, `avoidCollisions`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pa` | [`Position`](#interfaceshelperspositionmd) |
| `pb` | [`Position`](#interfaceshelperspositionmd) |
| `aLoc` | [`Location`](#location) |
| `bLoc` | [`Location`](#location) |
| `key1` | `string` |
| `key2` | `string` |
| `allPositions` | `Object` |
| `avoidCollisions` | `boolean` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `input` | [`Position`](#interfaceshelperspositionmd) |
| `output` | [`Position`](#interfaceshelperspositionmd) |

#### Defined in

[Helpers.tsx:303](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L303)

___

### CalcPos

▸ **CalcPos**(`pos`, `snap`, `minimum`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pos` | `number` |
| `snap` | `number` |
| `minimum` | `number` |

#### Returns

`number`

#### Defined in

[Helpers.tsx:32](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L32)

___

### getColor

▸ **getColor**(`color?`): [`ColorSet`](#colorset)

#### Parameters

| Name | Type |
| :------ | :------ |
| `color?` | [`ValidColor`](#validcolor) |

#### Returns

[`ColorSet`](#colorset)

#### Defined in

[Helpers.tsx:180](https://github.com/rhdeck/flowpoints-ts/blob/1a75920/src/Helpers.tsx#L180)


<a name="modulesindexmd"></a>

[@raydeck/flowpoints - v1.1.1](#readmemd) / index

# Module: index

## Table of contents

### References

- [Flowpoint](#flowpoint)
- [Flowspace](#flowspace)
- [Flowspace\_useFlowspace](#flowspace_useflowspace)
- [Helpers\_AutoGetLoc](#helpers_autogetloc)
- [Helpers\_CalcPos](#helpers_calcpos)
- [Helpers\_colors](#helpers_colors)
- [Helpers\_getColor](#helpers_getcolor)

## References

### Flowpoint

Renames and exports: [default](#default)

___

### Flowspace

Renames and exports: [default](#default)

___

### Flowspace\_useFlowspace

Renames and exports: [useFlowspace](#useflowspace)

___

### Helpers\_AutoGetLoc

Renames and exports: [AutoGetLoc](#autogetloc)

___

### Helpers\_CalcPos

Renames and exports: [CalcPos](#calcpos)

___

### Helpers\_colors

Renames and exports: [colors](#colors)

___

### Helpers\_getColor

Renames and exports: [getColor](#getcolor)
