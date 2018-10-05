defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Game.new(name)
      socket = socket
               |> assign(:game, game)
               |> assign(:name, name)
      {:ok, %{"game" => game}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end
  
  # add handle_in TODO
  def handle_in("click", payload, socket) do
    game = Game.update_state(socket.assigns[:game], payload["index"])
    Memory.BackupAgent.save(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{"game" => game}}, socket}
  end

  def handle_in("update", payload, socket) do
    game = %{
      board: payload["board"],
      actual: payload["actual"],
      isEnabled: payload["isEnabled"],
      score: payload["score"],
      noClick: payload["noClick"],
      index1: payload["index1"],
      index2: payload["index2"],
      char1: payload["char1"],
      char2: payload["char2"],
      clickable: payload["clickable"],
      name: payload["name"]
    }
    Memory.BackupAgent.save(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{"game" => game}}, socket}
  end

  def handle_in("updateName", payload, socket) do
    game = %{
      board: payload["board"],
      actual: payload["actual"],
      isEnabled: payload["isEnabled"],
      score: payload["score"],
      noClick: payload["noClick"],
      index1: payload["index1"],
      index2: payload["index2"],
      char1: payload["char1"],
      char2: payload["char2"],
      clickable: payload["clickable"],
      name: payload["name"]
    }
    Memory.BackupAgent.save(socket.assigns[:name], game)
    socket = socket
             |> assign(:game, game)
    {:reply, {:ok, %{"game" => game}}, socket}
  end

  def handle_in("new", payload, socket) do
    game = Game.new(payload["name"])
    Memory.BackupAgent.save(socket.assigns[:name], game)
    socket = socket
             |> assign(:game, game)
    {:reply, {:ok, %{"game" => game}}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
