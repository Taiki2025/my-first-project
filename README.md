# my-first-project
GitHub の最初のプロジェクト
import pygame
import random

# Pygame の初期化
pygame.font.init()

# ===== 定数定義 =====
# ウィンドウサイズ
s_width = 800
s_height = 700

# ゲームプレイエリアのサイズ（ブロック10列×20行、各ブロックサイズ30ピクセル）
play_width = 300   # 10 * 30
play_height = 600  # 20 * 30
block_size = 30

# ゲームプレイエリアの左上の座標（ウィンドウ中央に表示）
top_left_x = (s_width - play_width) // 2
top_left_y = s_height - play_height - 50

# ===== テトリミノの形状 =====
# 各形状は、複数の回転パターン（5×5 の文字列）として定義
S = [['.....',
      '.....',
      '..00.',
      '.00..',
      '.....'],
     ['.....',
      '..0..',
      '..00.',
      '...0.',
      '.....']]

Z = [['.....',
      '.....',
      '.00..',
      '..00.',
      '.....'],
     ['.....',
      '..0..',
      '.00..',
      '.0...',
      '.....']]

I = [['..0..',
      '..0..',
      '..0..',
      '..0..',
      '.....'],
     ['.....',
      '0000.',
      '.....',
      '.....',
      '.....']]

O = [['.....',
      '.....',
      '.00..',
      '.00..',
      '.....']]

J = [['.....',
      '.0...',
      '.000.',
      '.....',
      '.....'],
     ['.....',
      '..00.',
      '..0..',
      '..0..',
      '.....'],
     ['.....',
      '.....',
      '.000.',
      '...0.',
      '.....'],
     ['.....',
      '..0..',
      '..0..',
      '.00..',
      '.....']]

L = [['.....',
      '...0.',
      '.000.',
      '.....',
      '.....'],
     ['.....',
      '..0..',
      '..0..',
      '..00.',
      '.....'],
     ['.....',
      '.....',
      '.000.',
      '.0...',
      '.....'],
     ['.....',
      '.00..',
      '..0..',
      '..0..',
      '.....']]

T = [['.....',
      '..0..',
      '.000.',
      '.....',
      '.....'],
     ['.....',
      '..0..',
      '..00.',
      '..0..',
      '.....'],
     ['.....',
      '.....',
      '.000.',
      '..0..',
      '.....'],
     ['.....',
      '..0..',
      '.00..',
      '..0..',
      '.....']]

# 形状とそれに対応する色（R,G,B）
shapes = [S, Z, I, O, J, L, T]
shape_colors = [
    (0, 255, 0),    # S: 緑
    (255, 0, 0),    # Z: 赤
    (0, 255, 255),  # I: シアン
    (255, 255, 0),  # O: 黄色
    (255, 165, 0),  # J: オレンジ
    (0, 0, 255),    # L: 青
    (128, 0, 128)   # T: 紫
]

# ===== Piece クラス =====
class Piece(object):
    def __init__(self, x, y, shape):
        self.x = x  # グリッド上での横位置
        self.y = y  # グリッド上での縦位置
        self.shape = shape  # 形状（回転パターンのリスト）
        self.color = shape_colors[shapes.index(shape)]
        self.rotation = 0  # 現在の回転（0～）

# ===== グリッド作成 =====
def create_grid(locked_positions={}):
    """
    locked_positions: {(x, y): (R,G,B), ...} 既に固定されたブロックの位置と色
    """
    grid = [[(0, 0, 0) for _ in range(10)] for _ in range(20)]
    
    for i in range(len(grid)):
        for j in range(len(grid[i])):
            if (j, i) in locked_positions:
                grid[i][j] = locked_positions[(j, i)]
    return grid

# ===== 形状の座標変換 =====
def convert_shape_format(piece):
    """
    piece の現在の回転状態の文字列から、グリッド上の位置リストに変換する。
    ※回転パターンは 5x5 の行列で定義しており、左上からのオフセットが必要
    """
    positions = []
    format = piece.shape[piece.rotation % len(piece.shape)]
    
    for i, line in enumerate(format):
        row = list(line)
        for j, column in enumerate(row):
            if column == '0':
                # 5×5 の文字列の中でのオフセット補正（通常 -2, -4 で中心寄せ）
                positions.append((piece.x + j - 2, piece.y + i - 4))
    return positions

# ===== 有効な位置かチェック =====
def valid_space(piece, grid):
    """
    piece がグリッド内かつ既に固定されているブロックと重なっていないかを確認する
    """
    accepted_positions = [[(j, i) for j in range(10) if grid[i][j] == (0, 0, 0)] for i in range(20)]
    accepted_positions = [j for sub in accepted_positions for j in sub]
    
    formatted = convert_shape_format(piece)
    
    for pos in formatted:
        if pos not in accepted_positions:
            if pos[1] > -1:
                return False
    return True

# ===== ゲームオーバーチェック =====
def check_lost(positions):
    """
    locked_positions の中に y 座標が 0 未満のものがあればゲームオーバー
    """
    for pos in positions:
        x, y = pos
        if y < 1:
            return True
    return False

# ===== ランダムな形状を取得 =====
def get_shape():
    return Piece(5, 0, random.choice(shapes))

# ===== テキストを画面中央に描画 =====
def draw_text_middle(surface, text, size, color):
    font = pygame.font.SysFont('comicsans', size, bold=True)
    label = font.render(text, 1, color)
    
    surface.blit(label, (top_left_x + play_width / 2 - label.get_width() / 2,
                         top_left_y + play_height / 2 - label.get_height() / 2))

# ===== グリッド線を描画 =====
def draw_grid(surface, grid):
    sx = top_left_x
    sy = top_left_y
    for i in range(len(grid)):
        # 横線
        pygame.draw.line(surface, (128, 128, 128), (sx, sy + i * block_size),
                         (sx + play_width, sy + i * block_size))
        for j in range(len(grid[i])):
            # 縦線
            pygame.draw.line(surface, (128, 128, 128), (sx + j * block_size, sy),
                             (sx + j * block_size, sy + play_height))

# ===== ラインを消去 =====
def clear_rows(grid, locked):
    """
    グリッド内の一列が全て埋まっていたら、その行を消去し、上の行を下にずらす
    """
    inc = 0
    for i in range(len(grid)-1, -1, -1):
        row = grid[i]
        if (0, 0, 0) not in row:
            inc += 1
            ind = i
            for j in range(len(row)):
                try:
                    del locked[(j, i)]
                except:
                    continue
    if inc > 0:
        # locked 内のブロックの y 座標をずらす
        for key in sorted(list(locked), key=lambda x: x[1])[::-1]:
            x, y = key
            if y < ind:
                newKey = (x, y + inc)
                locked[newKey] = locked.pop(key)
    return inc

# ===== 次の形状を描画 =====
def draw_next_shape(piece, surface):
    font = pygame.font.SysFont('comicsans', 30)
    label = font.render('Next Shape', 1, (255, 255, 255))
    
    sx = top_left_x + play_width + 50
    sy = top_left_y + play_height / 2 - 100
    format = piece.shape[piece.rotation % len(piece.shape)]
    
    for i, line in enumerate(format):
        row = list(line)
        for j, column in enumerate(row):
            if column == '0':
                pygame.draw.rect(surface, piece.color,
                                 (sx + j * block_size, sy + i * block_size, block_size, block_size), 0)
    
    surface.blit(label, (sx + 10, sy - 30))

# ===== スコア管理 =====
def update_score(new_score):
    score = max_score()
    
    with open('scores.txt', 'w') as f:
        if int(score) > new_score:
            f.write(str(score))
        else:
            f.write(str(new_score))

def max_score():
    try:
        with open('scores.txt', 'r') as f:
            lines = f.readlines()
            score = lines[0].strip()
    except:
        score = "0"
    return score

# ===== 画面描画 =====
def draw_window(surface, grid, score=0):
    surface.fill((0, 0, 0))
    # タイトル描画
    font = pygame.font.SysFont('comicsans', 60)
    label = font.render('Tetris', 1, (255, 255, 255))
    
    surface.blit(label, (top_left_x + play_width / 2 - label.get_width() / 2, 30))
    
    # スコア表示
    font = pygame.font.SysFont('comicsans', 30)
    label = font.render('Score: ' + str(score), 1, (255, 255, 255))
    
    sx = top_left_x - 200
    sy = top_left_y + 200
    surface.blit(label, (sx + 20, sy + 160))
    
    # グリッド内のブロック描画
    for i in range(len(grid)):
        for j in range(len(grid[i])):
            pygame.draw.rect(surface, grid[i][j],
                             (top_left_x + j * block_size, top_left_y + i * block_size, block_size, block_size), 0)
    
    # ゲームプレイエリアの枠線
    pygame.draw.rect(surface, (255, 0, 0), (top_left_x, top_left_y, play_width, play_height), 5)
    draw_grid(surface, grid)

# ===== メインのゲームループ =====
def main(win):
    locked_positions = {}
    grid = create_grid(locked_positions)
    
    change_piece = False
    run = True
    current_piece = get_shape()
    next_piece = get_shape()
    clock = pygame.time.Clock()
    fall_time = 0
    fall_speed = 0.27
    level_time = 0
    score = 0
    
    while run:
        grid = create_grid(locked_positions)
        fall_time += clock.get_rawtime()
        level_time += clock.get_rawtime()
        clock.tick()
        
        # 一定時間ごとに落下速度を上げる
        if level_time / 1000 > 5:
            level_time = 0
            if fall_speed > 0.12:
                fall_speed -= 0.005
                
        # ブロックを下に移動
        if fall_time / 1000 > fall_speed:
            fall_time = 0
            current_piece.y += 1
            if not valid_space(current_piece, grid) and current_piece.y > 0:
                current_piece.y -= 1
                change_piece = True
        
        # イベント処理
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False
                pygame.display.quit()
                quit()
            
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LEFT:
                    current_piece.x -= 1
                    if not valid_space(current_piece, grid):
                        current_piece.x += 1
                if event.key == pygame.K_RIGHT:
                    current_piece.x += 1
                    if not valid_space(current_piece, grid):
                        current_piece.x -= 1
                if event.key == pygame.K_DOWN:
                    current_piece.y += 1
                    if not valid_space(current_piece, grid):
                        current_piece.y -= 1
                if event.key == pygame.K_UP:
                    current_piece.rotation = (current_piece.rotation + 1) % len(current_piece.shape)
                    if not valid_space(current_piece, grid):
                        current_piece.rotation = (current_piece.rotation - 1) % len(current_piece.shape)
        
        shape_pos = convert_shape_format(current_piece)
        
        # 現在のピースをグリッドに反映
        for i in range(len(shape_pos)):
            x, y = shape_pos[i]
            if y > -1:
                grid[y][x] = current_piece.color
        
        # ピースが固定できる状態なら、固定して新たなピースを生成
        if change_piece:
            for pos in shape_pos:
                locked_positions[pos] = current_piece.color
            current_piece = next_piece
            next_piece = get_shape()
            change_piece = False
            # 消せた行数に応じてスコア加算（1行で10点）
            score += clear_rows(grid, locked_positions) * 10
        
        draw_window(win, grid, score)
        draw_next_shape(next_piece, win)
        pygame.display.update()
        
        if check_lost(locked_positions):
            draw_text_middle(win, "YOU LOST", 80, (255, 255, 255))
            pygame.display.update()
            pygame.time.delay(1500)
            run = False
            update_score(score)

# ===== メインメニュー =====
def main_menu(win):
    run = True
    while run:
        win.fill((0, 0, 0))
        draw_text_middle(win, "Press any key to begin", 60, (255, 255, 255))
        pygame.display.update()
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False
            if event.type == pygame.KEYDOWN:
                main(win)
    pygame.quit()

# ===== エントリーポイント =====
if __name__ == '__main__':
    win = pygame.display.set_mode((s_width, s_height))
    pygame.display.set_caption('Tetris')
    main_menu(win)
