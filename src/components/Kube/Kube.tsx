import React, { useEffect, useRef, useState } from 'react';
import styles from './Kube.module.css';

interface IKubeData {
  text: string;
  color: string;
}

const Kube = () => {
  let [state, setState] = useState({
    playerWon: false,

    isPlaying: false,

    direction: null as unknown as string,

    current: {
      text: 'center',
      color: '#D4D9DC',
    },

    horizontal: [
      {
        text: 'horizontal 1',
        color: '#00C46B',
      },
      {
        text: 'horizontal 2',
        color: '#FFD002',
      },
      {
        text: 'horizontal 3',
        color: '#F02529',
      },
    ],

    vertical: [
      {
        text: 'vertical 1',
        color: '#00C46B',
      },
      {
        text: 'vertical 2',
        color: '#FFD002',
      },
      {
        text: 'vertical 3',
        color: '#F02529',
      },
    ],
  });

  let verticalBefore = useRef(null as unknown as HTMLDivElement);
  let verticalAfter = useRef(null as unknown as HTMLDivElement);
  let horizontalBefore = useRef(null as unknown as HTMLDivElement);
  let horizontalAfter = useRef(null as unknown as HTMLDivElement);
  let main = useRef(null as unknown as HTMLDivElement);

  function shuffleArray(array: IKubeData[]) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function resetKube() {
    verticalBefore.current?.classList.remove(styles.verticalBeforeFrameAnimating);
    verticalAfter.current?.classList.remove(styles.verticalAfterFrameAnimating);
    horizontalBefore.current?.classList.remove(styles.horizontalBeforeFrameAnimating);
    horizontalAfter.current?.classList.remove(styles.horizontalAfterFrameAnimating);
    main.current?.classList.remove(styles.mainFrameRotateLeft);
    main.current?.classList.remove(styles.mainFrameRotateTop);
    main.current?.classList.remove(styles.mainFrameRotateRight);
    main.current?.classList.remove(styles.mainFrameRotateBottom);
  }

  function validateShuffle(horizontal: IKubeData[], vertical: IKubeData[]) {
    return (
      horizontal[0].text !== 'horizontal 1' ||
      horizontal[1].text !== 'horizontal 2' ||
      horizontal[2].text !== 'horizontal 3' ||
      vertical[0].text !== 'vertical 1' ||
      vertical[1].text !== 'vertical 2' ||
      vertical[2].text !== 'vertical 3'
    );
  }

  function validateConfig() {
    if (
      state.horizontal[0].text === 'horizontal 1' &&
      state.horizontal[1].text === 'horizontal 2' &&
      state.horizontal[2].text === 'horizontal 3' &&
      state.vertical[0].text === 'vertical 1' &&
      state.vertical[1].text === 'vertical 2' &&
      state.vertical[2].text === 'vertical 3'
    )
      setState({
        ...state,
        playerWon: true,
      });
  }

  useEffect(() => {
    let tempHorizontal = null as unknown as IKubeData[];
    let tempVertical = null as unknown as IKubeData[];

    do {
      tempHorizontal = shuffleArray([...state.horizontal]);
      tempVertical = shuffleArray([...state.vertical]);
    } while (!validateShuffle(tempHorizontal, tempVertical));

    setState({
      ...state,
      horizontal: tempHorizontal,
      vertical: tempVertical,
    });
  }, []);

  useEffect(() => {
    (async () => {
      if (!state.isPlaying) return;

      await sleep(800);

      resetKube();

      switch (state.direction) {
        case 'left': {
          let current = {
            ...state.current,
          };
          let horizontal = [...state.horizontal];
          horizontal.unshift(current);
          current = horizontal.pop() as IKubeData;
          setState({
            ...state,
            horizontal,
            current,
            isPlaying: false,
          });

          break;
        }

        case 'top': {
          let current = {
            ...state.current,
          };
          let vertical = [...state.vertical];
          vertical.unshift(current);
          current = vertical.pop() as IKubeData;
          setState({
            ...state,
            vertical,
            current,
            isPlaying: false,
          });

          break;
        }

        case 'right': {
          let current = {
            ...state.current,
          };
          let horizontal = [...state.horizontal];
          horizontal.push(current);
          current = horizontal.shift() as IKubeData;
          setState({
            ...state,
            horizontal,
            current,
            isPlaying: false,
          });

          break;
        }

        case 'bottom': {
          let current = {
            ...state.current,
          };
          let vertical = [...state.vertical];
          vertical.push(current);
          current = vertical.shift() as IKubeData;
          setState({
            ...state,
            vertical,
            current,
            isPlaying: false,
          });

          break;
        }
      }

      validateConfig();
    })();
  }, [state.isPlaying]);

  function handleRotate(
    direction: string
  ): (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void {
    return (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (state.isPlaying) return;

      switch (direction) {
        case 'left': {
          main.current?.classList.add(styles.mainFrameRotateLeft);
          horizontalAfter.current?.classList.add(styles.horizontalAfterFrameAnimating);
          break;
        }

        case 'top': {
          main.current?.classList.add(styles.mainFrameRotateTop);
          verticalAfter.current?.classList.add(styles.verticalAfterFrameAnimating);
          break;
        }

        case 'right': {
          main.current?.classList.add(styles.mainFrameRotateRight);
          horizontalBefore.current?.classList.add(styles.horizontalBeforeFrameAnimating);
          break;
        }

        case 'bottom': {
          main.current?.classList.add(styles.mainFrameRotateBottom);
          verticalBefore.current?.classList.add(styles.verticalBeforeFrameAnimating);
          break;
        }
      }

      setState({
        ...state,
        isPlaying: true,
        direction,
      });
    };
  }

  return (
    <>
      <div>
        Правила игры:
        <br />
        есть <span style={{ textDecoration: 'line-through' }}>два стула</span> куб, у него стороны
        перемешаны, нужно получить конфигурацию, при которой:
        <br />
        1. В центре серый куб с именем "center"
        <br />
        2. При нажатии по кнопке "rotate kube right" кубы будут идти в порядке "horizontal
        1"-"horizontal 2"-"horizontal 3"
        <br />
        3. При нажатии по кнопке "rotate kube top" кубы будут идти в порядке "vertical 1"-"vertical
        2"-"vertical 3"
        <br />
        <br />
        Пройдете, <b>ОБЯЗАТЕЛЬНО СООБЩИТЕ МНЕ</b>, я не смог
      </div>
      <div className={styles.wrapper}>
        {state.playerWon ? (
          <div className={styles.winText}>
            Ну выиграл,
            <br /> чо,
            <br />
            поздравляю,
            <br /> лол
            <br /> перезапускай страницу
          </div>
        ) : (
          <>
            <div className={styles.arrowWrapper} onClick={handleRotate('left')}>
              rotate kube left
            </div>
            <div className={styles.arrowWrapper} onClick={handleRotate('top')}>
              rotate kube top
            </div>
            <div className={styles.arrowWrapper} onClick={handleRotate('right')}>
              rotate kube right
            </div>
            <div className={styles.arrowWrapper} onClick={handleRotate('bottom')}>
              rotate kube bottom
            </div>
            <div className={styles.frameWrapper}>
              <div
                className={[styles.frame, styles.verticalBeforeFrame].join(' ')}
                style={{ background: state.vertical[0].color }}
                ref={verticalBefore}
              >
                {state.vertical[0].text}
              </div>

              <div
                className={[styles.frame, styles.verticalAfterFrame].join(' ')}
                style={{ background: state.vertical[state.vertical.length - 1].color }}
                ref={verticalAfter}
              >
                {state.vertical[state.vertical.length - 1].text}
              </div>

              <div
                className={[styles.frame, styles.horizontalBeforeFrame].join(' ')}
                style={{ background: state.horizontal[0].color }}
                ref={horizontalBefore}
              >
                {state.horizontal[0].text}
              </div>

              <div
                className={[styles.frame, styles.horizontalAfterFrame].join(' ')}
                style={{ background: state.horizontal[state.horizontal.length - 1].color }}
                ref={horizontalAfter}
              >
                {state.horizontal[state.horizontal.length - 1].text}
              </div>

              <div
                className={[styles.frame, styles.mainFrame].join(' ')}
                style={{ background: state.current.color }}
                ref={main}
              >
                {state.current.text}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Kube;
