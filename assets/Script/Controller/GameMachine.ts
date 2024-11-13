import { _decorator } from 'cc';
import { Chooser, GameValue, MatrixCaro, ResultWinner, WINNING_LENGTH } from '../Model/Data'; // Kiểm tra lại đường import WINNING_LENGTH
const { ccclass, property } = _decorator;

@ccclass('GameMachine')
export class GameMachine {

    checkWinner(value: GameValue): ResultWinner {
        if (!value || !value.matrix) {
            return { winner: Chooser.Null, positions: [] };
        }
        const { column, row, matrix } = value;
        const winningPositions: { row: number, column: number }[] = [];
        // Kiểm tra các hàng (chiều ngang)
        for (let r = 0; r < row; r++) {
            for (let startRow = 0; startRow <= column - WINNING_LENGTH; startRow++) {
                const rowValues = matrix.slice(r * column + startRow, r * column + startRow + WINNING_LENGTH).map(cell => cell?.value);
                if (rowValues[0] !== Chooser.Null && rowValues.every(val => val === rowValues[0])) {
                    for (let i = 0; i < WINNING_LENGTH; i++) {
                        winningPositions.push({ column: r, row: startRow + i });
                    }
                    return { winner: rowValues[0]!, positions: winningPositions };
                }
            }
        }

        // Kiểm tra các cột (chiều dọc)
        for (let c = 0; c < column; c++) {
            for (let startCol = 0; startCol <= row - WINNING_LENGTH; startCol++) {
                const colValues = [];
                for (let r = startCol; r < startCol + WINNING_LENGTH; r++) {
                    colValues.push(matrix[r * column + c]?.value);
                }
                if (colValues[0] !== Chooser.Null && colValues.every(val => val === colValues[0])) {
                    for (let i = 0; i < WINNING_LENGTH; i++) {
                        winningPositions.push({ column: startCol + i, row: c });
                    }
                    return { winner: colValues[0]!, positions: winningPositions };
                }
            }
        }

        // Kiểm tra đường chéo (từ góc trên trái đến góc dưới phải)
        for (let startCol = 0; startCol <= row - WINNING_LENGTH; startCol++) {
            for (let startRow = 0; startRow <= column - WINNING_LENGTH; startRow++) {
                const diagonal1 = [];
                for (let i = 0; i < WINNING_LENGTH; i++) {
                    diagonal1.push(matrix[(startCol + i) * column + (startRow + i)]?.value);
                }
                if (diagonal1[0] !== Chooser.Null && diagonal1.every(val => val === diagonal1[0])) {
                    for (let i = 0; i < WINNING_LENGTH; i++) {
                        winningPositions.push({ column: startCol + i, row: startRow + i });
                    }
                    return { winner: diagonal1[0]!, positions: winningPositions };
                }
            }
        }

        // Kiểm tra đường chéo (từ góc trên phải đến góc dưới trái)
        for (let startCol = 0; startCol <= row - WINNING_LENGTH; startCol++) {
            for (let startRow = WINNING_LENGTH - 1; startRow < column; startRow++) {
                const diagonal2 = [];
                for (let i = 0; i < WINNING_LENGTH; i++) {
                    diagonal2.push(matrix[(startCol + i) * column + (startRow - i)]?.value);
                }
                if (diagonal2[0] !== Chooser.Null && diagonal2.every(val => val === diagonal2[0])) {
                    for (let i = 0; i < WINNING_LENGTH; i++) {
                        winningPositions.push({ column: startCol + i, row: startRow - i });
                    }
                    return { winner: diagonal2[0]!, positions: winningPositions };
                }
            }
        }

        // Nếu không có ai thắng, trả về Chooser.Null và danh sách vị trí rỗng
        return { winner: Chooser.Null, positions: [] };
    }

    BotMove(value: GameValue): MatrixCaro | null {
        // 1. Kiểm tra xem bot có thể thắng ngay không
        let bestMoveWin = this.getBlockByLength(Chooser.Bot, 3, value);
        if (bestMoveWin.length > 0) {
            let index = Math.floor(Math.random() * bestMoveWin.length);
            return { col: bestMoveWin[index].x, row: bestMoveWin[index].y, value: Chooser.Bot };
        }

        // 2. Kiểm tra xem đối thủ có thể thắng ngay không (cần chặn)
        let bestMoveBlock = this.getBlockByLength(Chooser.Player, 3, value);
        if (bestMoveBlock.length > 0) {
            let index = Math.floor(Math.random() * bestMoveBlock.length);
            return { col: bestMoveBlock[index].x, row: bestMoveBlock[index].y, value: Chooser.Bot };
        }

        // 3. Tạo các chuỗi dài 2 (AI) và chặn các chuỗi dài 2 (đối thủ)
        let bestMove2InRow = this.getBlockByLength(Chooser.Bot, 2, value);
        if (bestMove2InRow.length > 0) {
            let index = Math.floor(Math.random() * bestMove2InRow.length);
            return { col: bestMove2InRow[index].x, row: bestMove2InRow[index].y, value: Chooser.Bot };
        }

        let block2InRow = this.getBlockByLength(Chooser.Player, 2, value);
        if (block2InRow.length > 0) {
            let index = Math.floor(Math.random() * block2InRow.length);
            return { col: block2InRow[index].x, row: block2InRow[index].y, value: Chooser.Bot };
        }

        // 4. Tìm ô trống có thể mở ra cơ hội (ưu tiên trung tâm)
        let bestMove = this.getBestMoveAccordingToCocaroRules(value);
        if (bestMove) {
            return bestMove;
        }

        // Nếu không tìm thấy nước đi, trả về null
        return null;
    }

    getBestMoveAccordingToCocaroRules(value: GameValue): MatrixCaro | null {
        const boardSizeCol = value.column;
        const boardSizeRow = value.row;
        const matrix = value.matrix;

        let bestMove: MatrixCaro | null = null;
        let maxScore = -1;  // Điểm của nước đi tốt nhất

        for (let x = 0; x < boardSizeCol; x++) {
            for (let y = 0; y < boardSizeRow; y++) {
                if (this.getValuePersonByIndex(matrix, x, y) === Chooser.Null) {
                    let score = this.calculateMoveScore(x, y, value);
                    if (score > maxScore) {
                        maxScore = score;
                        bestMove = { col: x, row: y, value: Chooser.Bot }; // Chọn nước đi có điểm cao nhất
                    }
                }
            }
        }

        return bestMove;
    }

    calculateMoveScore(x: number, y: number, value: GameValue): number {
        const boardSizeCol = value.column;
        const boardSizeRow = value.row;
        const matrix = value.matrix;
        let score = 0;

        // Tính điểm dựa trên số chuỗi liên tiếp AI hoặc đối thủ có thể tạo ra
        const directions = [
            [1, 0],   // Horizontal right
            [0, 1],   // Vertical down
            [1, 1],   // Diagonal down-right
            [1, -1],  // Diagonal up-right
            [-1, 0],  // Horizontal left
            [0, -1],  // Vertical up
            [-1, -1], // Diagonal up-left
            [-1, 1],  // Diagonal down-left
        ];

        for (const [dx, dy] of directions) {
            let countBot = 0;
            let countPlayer = 0;

            for (let i = 1; i < 4; i++) { // Kiểm tra trong phạm vi 3 ô liên tiếp
                const nxBot = x + i * dx;
                const nyBot = y + i * dy;
                if (nxBot >= 0 && nxBot < boardSizeCol && nyBot >= 0 && nyBot < boardSizeRow &&
                    this.getValuePersonByIndex(matrix, nxBot, nyBot) === Chooser.Bot) {
                    countBot++;
                } else {
                    break;
                }
            }

            for (let i = 1; i < 4; i++) { // Kiểm tra đối thủ
                const nxPlayer = x + i * dx;
                const nyPlayer = y + i * dy;
                if (nxPlayer >= 0 && nxPlayer < boardSizeCol && nyPlayer >= 0 && nyPlayer < boardSizeRow &&
                    this.getValuePersonByIndex(matrix, nxPlayer, nyPlayer) === Chooser.Player) {
                    countPlayer++;
                } else {
                    break;
                }
            }

            // Nếu có chuỗi dài 2 cho bot, tăng điểm
            if (countBot === 2) {
                score += 10; // Tạo cơ hội cho bot
            }

            // Nếu đối thủ có chuỗi dài 2, tăng điểm để chặn
            if (countPlayer === 2) {
                score += 5; // Chặn đối thủ
            }
        }

        // Ưu tiên các ô gần trung tâm (thêm điểm)
        const centerX = Math.floor(boardSizeCol / 2);
        const centerY = Math.floor(boardSizeRow / 2);
        const distanceToCenter = Math.abs(centerX - x) + Math.abs(centerY - y);
        score -= distanceToCenter; // Khoảng cách xa trung tâm giảm điểm

        return score;
    }


    getBlockByLength(person: Chooser, length: number, value: GameValue) {
        const boardSizeCol = value.column;  // 9 columns
        const boardSizeRow = value.row;     // 9 rows
        const blocks = []

        const matrix = value.matrix;

        // Các hướng di chuyển: [x, y]
        const directions = [
            [1, 0],   // Horizontal right
            [0, 1],   // Vertical down
            [1, 1],   // Diagonal down-right
            [1, -1],  // Diagonal up-right
            [-1, 0],  // Horizontal left
            [0, -1],  // Vertical up
            [-1, -1], // Diagonal up-left
            [-1, 1],  // Diagonal down-left
        ];

        // Tìm kiếm các chuỗi liên tiếp trong các hướng
        for (let x = 0; x < boardSizeCol; x++) {
            for (let y = 0; y < boardSizeRow; y++) {
                // Tìm người chơi (hoặc AI) ở vị trí (x, y)
                const currentValue = this.getValuePersonByIndex(matrix, x, y);
                if (currentValue === person) {
                    // Kiểm tra chuỗi trong các hướng
                    for (const [dx, dy] of directions) {
                        let count = 1;  // Bắt đầu với một ô đã có người chơi
                        let endX = x;
                        let endY = y;

                        // Kiểm tra chuỗi trong một hướng nhất định
                        for (let i = 1; i < length; i++) {
                            endX = x + i * dx;
                            endY = y + i * dy;

                            // Nếu điểm tiếp theo hợp lệ và có giá trị giống nhau, tiếp tục
                            const nextValue = this.getValuePersonByIndex(matrix, endX, endY);
                            if (endX >= 0 && endX < boardSizeCol && endY >= 0 && endY < boardSizeRow && nextValue === person) {
                                count++;
                            } else {
                                break;
                            }

                            // Nếu đã đủ số lượng ô liên tiếp
                            if (count === length) {
                                // Kiểm tra vị trí chặn trước và sau chuỗi
                                const blockStartX = x - dx;
                                const blockStartY = y - dy;
                                const blockEndX = endX + dx;
                                const blockEndY = endY + dy;

                                // Kiểm tra các vị trí chặn hợp lệ (trống)
                                if (blockStartX >= 0 && blockStartX < boardSizeCol && blockStartY >= 0 && blockStartY < boardSizeRow &&
                                    this.getValuePersonByIndex(matrix, blockStartX, blockStartY) === Chooser.Null) {
                                    const block = { x: blockStartX, y: blockStartY };
                                    if (!this.isBlockDuplicate(blocks, block)) {
                                        blocks.push(block);
                                    }
                                }

                                if (blockEndX >= 0 && blockEndX < boardSizeCol && blockEndY >= 0 && blockEndY < boardSizeRow &&
                                    this.getValuePersonByIndex(matrix, blockEndX, blockEndY) === Chooser.Null) {
                                    const block = { x: blockEndX, y: blockEndY };
                                    if (!this.isBlockDuplicate(blocks, block)) {
                                        blocks.push(block);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return blocks;
    }

    isBlockDuplicate(blocks: { x: number, y: number }[], block: { x: number, y: number }) {
        // Kiểm tra nếu block đã tồn tại trong mảng blocks
        return blocks.some(existingBlock =>
            (existingBlock.x === block.x && existingBlock.y === block.y)
        );
    }
    // Hàm hỗ trợ để lấy giá trị từ matrix (dựa vào vị trí cột và hàng)
    getValuePersonByIndex(matrix: { col: number, row: number, value: number }[], col: number, row: number): Chooser {
        const found = matrix.find(cell => cell.col === col && cell.row === row);
        return found ? found.value : Chooser.Null;  // Trả về giá trị người chơi (hoặc Chooser.Null nếu không có)
    }

}

const gameMachine = new GameMachine();
export default gameMachine;
