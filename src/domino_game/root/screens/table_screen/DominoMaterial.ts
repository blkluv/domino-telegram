import {StandardMaterial} from "pixi3d";
import {LoaderService} from "@azur-games/pixi-vip-framework";


export class DominoMaterial extends StandardMaterial {
    constructor() {
        super();
        this.baseColorTexture = LoaderService.getTexture("assets/models/DominoTexture.webp");
        this.unlit = true;
    }

    private isWebGL2(renderer: any): boolean {
        return renderer.gl && renderer.gl.constructor.name === 'WebGL2RenderingContext';
    }

    createShader(mesh?: any, renderer?: any) {
        const isWebGL2 = this.isWebGL2(renderer);

        const fragmentWebGL2 = `#version 300 es
// WebGL 2.0 shader code
#define WEBGL2 1
#define HAS_NORMALS 1
#define HAS_UV_SET1 1
#define MATERIAL_UNLIT 1
#define MATERIAL_METALLICROUGHNESS 1
#define HAS_BASE_COLOR_MAP 1

#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

vec4 _texture(sampler2D sampler, vec2 coord)
{
    return texture(sampler, coord);
}

vec4 _texture(samplerCube sampler, vec3 coord)
{
    return texture(sampler, coord);
}

vec4 _textureLod(sampler2D sampler, vec2 coord, float lod)
{
    return textureLod(sampler, coord, lod);
}

vec4 _textureLod(samplerCube sampler, vec3 coord, float lod)
{
    return textureLod(sampler, coord, lod);
}

vec3 _dFdx(vec3 coord)
{
    return dFdx(coord);
}

vec3 _dFdy(vec3 coord)
{
    return dFdy(coord);
}

in vec2 v_UVCoord1;
in vec2 v_UVCoord2;

#ifdef HAS_BASE_COLOR_MAP
uniform sampler2D u_BaseColorSampler;
uniform int u_BaseColorUVSet;
uniform mat3 u_BaseColorUVTransform;
#endif

#ifdef MATERIAL_METALLICROUGHNESS
uniform float u_MetallicFactor;
uniform float u_RoughnessFactor;
uniform vec4 u_BaseColorFactor;
#endif

#ifdef USE_INSTANCING
in vec4 v_BaseColorFactor;
#endif

#ifdef HAS_VERTEX_COLOR_VEC3
in vec3 v_Color;
#endif
#ifdef HAS_VERTEX_COLOR_VEC4
in vec4 v_Color;
#endif

vec2 getBaseColorUV()
{
    vec3 uv = vec3(v_UVCoord1, 1.0);
#ifdef HAS_BASE_COLOR_MAP
    uv.xy = u_BaseColorUVSet < 1 ? v_UVCoord1 : v_UVCoord2;
    #ifdef HAS_BASECOLOR_UV_TRANSFORM
    uv = u_BaseColorUVTransform * uv;
    #endif
#endif
    return uv.xy;
}

vec4 getVertexColor()
{
   vec4 color = vec4(1.0, 1.0, 1.0, 1.0);

#ifdef HAS_VERTEX_COLOR_VEC3
    color.rgb = v_Color;
#endif
#ifdef HAS_VERTEX_COLOR_VEC4
    color = v_Color;
#endif

   return color;
}

out vec4 g_finalColor;

void main()
{
    vec4 baseColor = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 baseColorFactor = u_BaseColorFactor;
    
#ifdef USE_INSTANCING
    baseColorFactor = v_BaseColorFactor;
#endif

#ifdef HAS_BASE_COLOR_MAP
    baseColor = texture(u_BaseColorSampler, getBaseColorUV()) * baseColorFactor;
#else
    baseColor = baseColorFactor;
#endif

    baseColor *= getVertexColor();
    baseColor.a = 1.0;

    g_finalColor = vec4(baseColor.rgb * baseColor.a, 1.0);
}
`;

        const fragmentWebGL1 = `// WebGL 1.0 shader code
#define WEBGL1 1
#define HAS_NORMALS 1
#define HAS_UV_SET1 1
#define MATERIAL_UNLIT 1
#define MATERIAL_METALLICROUGHNESS 1
#define HAS_BASE_COLOR_MAP 1

#extension GL_OES_standard_derivatives : enable

#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

vec4 _texture(sampler2D sampler, vec2 coord)
{
    return texture2D(sampler, coord);
}

vec4 _texture(samplerCube sampler, vec3 coord)
{
    return textureCube(sampler, coord);
}

vec4 _textureLod(sampler2D sampler, vec2 coord, float lod)
{
    return vec4(0.0);
}

vec4 _textureLod(samplerCube sampler, vec3 coord, float lod)
{
    return vec4(0.0);
}

vec3 _dFdx(vec3 coord)
{
#ifdef GL_OES_standard_derivatives
    return dFdx(coord);
#endif
    return vec3(0.0);
}

vec3 _dFdy(vec3 coord)
{
#ifdef GL_OES_standard_derivatives
    return dFdy(coord);
#endif
    return vec3(0.0);
}

varying vec2 v_UVCoord1;
varying vec2 v_UVCoord2;

#ifdef HAS_BASE_COLOR_MAP
uniform sampler2D u_BaseColorSampler;
uniform int u_BaseColorUVSet;
uniform mat3 u_BaseColorUVTransform;
#endif

#ifdef MATERIAL_METALLICROUGHNESS
uniform float u_MetallicFactor;
uniform float u_RoughnessFactor;
uniform vec4 u_BaseColorFactor;
#endif

#ifdef USE_INSTANCING
varying vec4 v_BaseColorFactor;
#endif

#ifdef HAS_VERTEX_COLOR_VEC3
varying vec3 v_Color;
#endif
#ifdef HAS_VERTEX_COLOR_VEC4
varying vec4 v_Color;
#endif

vec2 getBaseColorUV()
{
    vec3 uv = vec3(v_UVCoord1, 1.0);
#ifdef HAS_BASE_COLOR_MAP
    uv.xy = u_BaseColorUVSet < 1 ? v_UVCoord1 : v_UVCoord2;
    #ifdef HAS_BASECOLOR_UV_TRANSFORM
    uv = u_BaseColorUVTransform * uv;
    #endif
#endif
    return uv.xy;
}

vec4 getVertexColor()
{
   vec4 color = vec4(1.0, 1.0, 1.0, 1.0);

#ifdef HAS_VERTEX_COLOR_VEC3
    color.rgb = v_Color;
#endif
#ifdef HAS_VERTEX_COLOR_VEC4
    color = v_Color;
#endif

   return color;
}

void main()
{
    vec4 baseColor = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 baseColorFactor = u_BaseColorFactor;
    
#ifdef USE_INSTANCING
    baseColorFactor = v_BaseColorFactor;
#endif

#ifdef HAS_BASE_COLOR_MAP
    baseColor = texture2D(u_BaseColorSampler, getBaseColorUV()) * baseColorFactor;
#else
    baseColor = baseColorFactor;
#endif

    baseColor *= getVertexColor();
    baseColor.a = 1.0;

    gl_FragColor = vec4(baseColor.rgb * baseColor.a, 1.0);
}
`;

        const fragment = isWebGL2 ? fragmentWebGL2 : fragmentWebGL1;

        let shader = super.createShader(mesh, renderer);
        shader.program.fragmentSrc = fragment;
        return shader;
    }
}