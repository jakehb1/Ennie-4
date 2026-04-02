import React, { useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  G,
  Path,
  Line,
  Circle,
  Text as SvgText,
  Filter,
  FeGaussianBlur,
  FeMerge,
  FeMergeNode,
} from "react-native-svg";
import { T } from "../../theme/tokens";

const BODY_PATH =
  "M100,30 C100,14 88,4 80,4 C72,4 68,10 68,18 C68,28 76,36 80,38 " +
  "L80,42 C76,44 60,50 56,56 L42,100 C40,106 44,110 48,110 L60,108 " +
  "L58,106 C56,104 56,100 58,96 L68,72 L68,130 C68,140 62,200 60,220 " +
  "L56,280 C54,300 56,310 60,316 L64,340 C66,348 70,352 76,352 " +
  "C82,352 84,348 82,340 L78,300 L80,260 L82,300 L78,340 " +
  "C76,348 78,352 84,352 C90,352 94,348 96,340 L100,316 " +
  "C104,310 106,300 104,280 L100,220 C98,200 92,140 92,130 " +
  "L92,72 L102,96 C104,100 104,104 102,106 L100,108 L112,110 " +
  "C116,110 120,106 118,100 L104,56 C100,50 84,44 80,42";

function getPinColor(severity) {
  if (severity > 6) return T.danger;
  if (severity > 3) return T.warm;
  return T.accent;
}

export default function BodyMap({
  side = "front",
  pins = [],
  onAddPin,
  onSelectPin,
  selectedPin,
  small = false,
}) {
  const w = small ? 140 : 200;
  const h = small ? 266 : 380;

  const handlePress = useCallback(
    (evt) => {
      if (!onAddPin) return;

      const { locationX, locationY } = evt.nativeEvent;
      const x = +((locationX / w) * 100).toFixed(1);
      const y = +((locationY / h) * 100).toFixed(1);

      // Only allow pins within the body silhouette area
      if (x > 15 && x < 85 && y > 3 && y < 95) {
        onAddPin(x, y, side);
      }
    },
    [onAddPin, w, h, side]
  );

  const sidePins = pins.filter((p) => p.side === side);
  const gradId = `bg${side}${small ? "s" : ""}`;

  return (
    <View style={[styles.container, { width: w }]}>
      <Svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        onPress={handlePress}
      >
        <Defs>
          <RadialGradient id={gradId} cx="50%" cy="30%">
            <Stop offset="0%" stopColor="#D8D0EC" />
            <Stop offset="100%" stopColor="#C8BEE0" />
          </RadialGradient>
        </Defs>

        {/* Spine line for back view */}
        {side === "back" && (
          <Line
            x1={w / 2}
            y1={h * 0.11}
            x2={w / 2}
            y2={h * 0.82}
            stroke={T.textDim}
            strokeWidth={0.5}
            strokeDasharray="3,3"
            opacity={0.3}
          />
        )}

        {/* Body silhouette */}
        <G
          transform={`scale(${w / 200},${h / 380}) translate(20,8)`}
        >
          <Path
            d={BODY_PATH}
            fill={`url(#${gradId})`}
            stroke={T.borderLight}
            strokeWidth={1.5}
          />
        </G>

        {/* Side label */}
        <SvgText
          x={w / 2}
          y={h - 4}
          textAnchor="middle"
          fill={T.textDim}
          fontSize={small ? 10 : 12}
        >
          {side.toUpperCase()}
        </SvgText>

        {/* Pins */}
        {sidePins.map((p) => {
          const cx = (p.x / 100) * w;
          const cy = (p.y / 100) * h;
          const sel = selectedPin === p.id;
          const c = getPinColor(p.severity);

          return (
            <G
              key={p.id}
              onPress={(e) => {
                e.stopPropagation?.();
                onSelectPin?.(p.id);
              }}
            >
              {/* Outer glow */}
              <Circle
                cx={cx}
                cy={cy}
                r={small ? 10 : 14}
                fill={c}
                opacity={0.15}
              />
              {/* Inner pin */}
              <Circle
                cx={cx}
                cy={cy}
                r={sel ? 8 : 6}
                fill={c}
                opacity={sel ? 0.9 : 0.7}
              />
              {/* Severity label */}
              <SvgText
                x={cx}
                y={cy + (small ? 2 : 3)}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize={small ? 6 : 8}
                fontWeight="700"
              >
                {p.severity}
              </SvgText>
              {/* Selection ring */}
              {sel && (
                <Circle
                  cx={cx}
                  cy={cy}
                  r={small ? 13 : 17}
                  fill="none"
                  stroke={c}
                  strokeWidth={1.5}
                  strokeDasharray="3,2"
                  opacity={0.5}
                />
              )}
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
