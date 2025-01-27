import { Props } from "./types";
import { OperationEntity } from "@hautechai/sdk";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCollectionStacks } from "./api";
import { getImageFromStack } from "./utils";

const useLogic = (props: Props) => {
  const scrollController = useRef<{ scrollToTop: () => void } | undefined>(
    undefined
  );

  const [selectedStackId, setSelectedStackId] = useState<string | null>(null);

  const stacksAPI = useCollectionStacks(props.widgetProps.collectionId);
  const stacks = stacksAPI.read();

  const [loading, setLoading] = useState(false);

  const onGetImages = useCallback(async () => {
    const visibleStacks = stacks.value;

    return visibleStacks
      .map((stack) => getImageFromStack(stack))
      .filter((imageId) => !!imageId) as string[];
  }, [stacks.value]);

  const onStart = useCallback(async () => {
    const shouldScroll = stacks.value.length > 0;
    setLoading(true);

    try {
      let operation = await props.sdk.operations.create.generate.v1({
        input: {
          aspectRatio: props.widgetProps.input.aspectRatio ?? "1:1",
          imageWeight: props.widgetProps.input.imageWeight ?? 0.5,
          negativePrompt: props.widgetProps.input.negativePrompt ?? "",
          guidanceScale: props.widgetProps.input.guidanceScale ?? 7,
          inferenceSteps: props.widgetProps.input.inferenceSteps ?? 20,
          productImageId: props.widgetProps.input.productImageId,
          prompt: props.widgetProps.input.prompt,
          seed: props.widgetProps.input.seed ?? props.sdk.utils.seed(),
          strength: props.widgetProps.input.strength ?? 0.8,
        },
      });
      operation = await props.sdk.operations.wait({ id: operation.id });

      for (const imageId of (operation.output as any)?.imageIds ?? []) {
        const newStack = await stacksAPI.create();
        await stacksAPI.addItems({
          id: newStack.id,
          itemIds: [operation.id, imageId],
        });
      }

      if (shouldScroll)
        setTimeout(() => scrollController.current?.scrollToTop(), 500);
    } finally {
      setLoading(false);
    }
  }, [props.widgetProps.input, stacks.value]);

  const onDeselectStack = useCallback(() => setSelectedStackId(null), []);
  const onDownloadImage = useCallback(
    async (imageId: string) => {
      await props.widgetMethods.downloadImage({ imageId });
    },
    [props.widgetMethods.downloadImage]
  );
  const onInitScrollController = useCallback(
    (controller: { scrollToTop: () => void } | undefined) => {
      scrollController.current = controller;
    },
    []
  );
  const onSelectStack = useCallback(
    (stackId: string) => setSelectedStackId(stackId),
    []
  );

  useEffect(() => {
    props.setIncomingMethodHandlers({
      getImages: onGetImages,
      start: onStart,
    });
  }, [onGetImages, onStart]);

  useEffect(() => {
    const callback = (operation: OperationEntity) =>
      stacksAPI.updateOperation(operation);
    props.sdk.operations.updates.subscribe({ callback });
    return () => props.sdk.operations.updates.unsubscribe({ callback });
  }, []);

  return {
    loading,
    onDeselectStack,
    onDownloadImage,
    onInitScrollController,
    onSelectStack,
    selectedStackId,
    stacks: stacks.value,
  };
};

export default useLogic;
