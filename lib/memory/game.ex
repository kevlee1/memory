defmodule Memory.Game do
  def new(name) do
    %{
      board: ["?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?"],
      actual: Enum.shuffle(["A", "B", "C", "D", "E", "F", "G", "H", "A", "B", "C", "D", "E", "F", "G", "H"]),
      isEnabled: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
      score: 0,
      noClick: 0,
      index1: -1,
      index2: -1,
      char1: "",
      char2: "",
      clickable: true,
      name: name
    }
  end

  def update_state(state, index) do
    if (state.clickable) do
      tempBoard = state.board
      tempIsEnabled = state.isEnabled
      tempScore = state.score
      IO.puts index
      char = Enum.fetch!(state.actual, index)
      chars = []
      chars = chars ++ [state.char1]
      chars = chars ++ [char]
      tempIndex = index
      indexes = []
      indexes = indexes ++ [state.index1]
      indexes = indexes ++ [tempIndex]
      clickable = state.clickable
      if Enum.fetch!(state.isEnabled, index) do
        clicks = state.noClick
        clicks = clicks+1
        if rem(clicks, 2) == 1 do
          tempBoard = List.replace_at(tempBoard, index, Enum.fetch!(state.actual, index))
          tempIsEnabled = List.replace_at(tempIsEnabled, index, false)
        else
          tempBoard = List.replace_at(tempBoard, index, Enum.fetch!(state.actual, index))
          tempIsEnabled = List.replace_at(tempIsEnabled, index, false)
          if Enum.fetch!(chars, 0) == Enum.fetch!(chars, 1) do
            if clicks > 32 do
              tempScore = tempScore + 10
            else
              tempScore = tempScore + 20
            end
          else
            clickable = false
          end
        end
        %{
          board: tempBoard,
          actual: state.actual,
          isEnabled: tempIsEnabled,
          score: tempScore,
          noClick: clicks,
          index1: Enum.fetch!(tempIndex, 1),
          index2: Enum.fetch!(tempIndex, 0),
          char1: Enum.fetch!(chars, 1),
          char2: Enum.fetch!(chars, 0),
          clickable: clickable,
          name: state.name
        }
        else
        %{
          board: state.board,
					actual: state.actual,
					isEnabled: state.isEnabled,
					score: state.score,
					noClick: state.noClick,
					index1: state.index1,
					index2: state.index2,
					char1: state.char1,
					char2: state.char2,
					clickable: state.clickable,
          name: state.name
        }
      end
      else
      %{
        board: state.board,
        actual: state.actual,
					isEnabled: state.isEnabled,
					score: state.score,
					noClick: state.noClick,
					index1: state.index1,
					index2: state.index2,
					char1: state.char1,
					char2: state.char2,
					clickable: state.clickable,
        name: state.name
      }
    end
  end
end


